import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from lib.db import client, db, ensure_indexes

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 24
REFRESH_TOKEN_DAYS = 7
PLAN_PRICE = 1499
BOOKS_PER_CYCLE = 4
CYCLES_PER_PLAN = 3
CYCLE_DAYS = 30
REMINDER_DAYS_BEFORE = 3
MAX_ATTEMPTS = 5
LOCK_MINUTES = 15

SERVICEABLE_PINCODES: dict[str, dict] = {
    "560001": {"hub": "MG Road Central", "city": "Bengaluru", "eta_days": 1},
    "560034": {"hub": "Koramangala", "city": "Bengaluru", "eta_days": 1},
    "560038": {"hub": "Indiranagar", "city": "Bengaluru", "eta_days": 1},
    "560066": {"hub": "Whitefield", "city": "Bengaluru", "eta_days": 2},
    "110001": {"hub": "Connaught Place", "city": "New Delhi", "eta_days": 2},
    "110016": {"hub": "Hauz Khas", "city": "New Delhi", "eta_days": 2},
    "400001": {"hub": "Fort", "city": "Mumbai", "eta_days": 2},
    "400050": {"hub": "Bandra West", "city": "Mumbai", "eta_days": 2},
    "500081": {"hub": "HITEC City", "city": "Hyderabad", "eta_days": 2},
    "500034": {"hub": "Banjara Hills", "city": "Hyderabad", "eta_days": 2},
    "411001": {"hub": "Pune Camp", "city": "Pune", "eta_days": 2},
    "411045": {"hub": "Baner", "city": "Pune", "eta_days": 3},
}


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access", "exp": utcnow() + timedelta(minutes=ACCESS_TOKEN_MINUTES)}
    return jwt.encode(payload, jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh", "exp": utcnow() + timedelta(days=REFRESH_TOKEN_DAYS)}
    return jwt.encode(payload, jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str) -> None:
    response.set_cookie("access_token", create_access_token(user_id, email), httponly=True, secure=True, samesite="none", max_age=ACCESS_TOKEN_MINUTES * 60, path="/")
    response.set_cookie("refresh_token", create_refresh_token(user_id), httponly=True, secure=True, samesite="none", max_age=REFRESH_TOKEN_DAYS * 86400, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            token = header[7:]
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(401, "Invalid token type")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(401, "User not found")
    return user


# ---------- models ----------

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=6)
    phone: str = Field(min_length=10, max_length=15)
    pincode: str = Field(min_length=6, max_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    phone: str = ""
    pincode: str = ""
    role: str = "member"
    created_at: datetime


class PincodeCheck(BaseModel):
    pincode: str
    serviceable: bool
    hub: str | None = None
    city: str | None = None
    eta_days: int | None = None
    message: str


class Book(BaseModel):
    id: str
    title: str
    author: str
    genre: str
    isbn: str
    cover_url: str
    pages: int
    synopsis: str
    copies_total: int
    copies_available: int


class SubscriptionRequest(BaseModel):
    payment_method: str = "upi"


class Subscription(BaseModel):
    id: str
    user_id: str
    plan: str = "Quarterly Reading Plan"
    amount: int = PLAN_PRICE
    status: str = "active"
    start_date: datetime
    end_date: datetime
    current_cycle: int = 0
    books_rented_total: int = 0
    payment_method: str = "upi"
    created_at: datetime


class RentalCreate(BaseModel):
    book_ids: list[str]


class Rental(BaseModel):
    id: str
    user_id: str
    subscription_id: str
    cycle: int
    book_ids: list[str]
    books: list[Book] = []
    status: str = "delivered"
    ordered_at: datetime
    due_date: datetime
    returned_at: datetime | None = None


class AppNotification(BaseModel):
    id: str
    kind: str
    title: str
    body: str
    channel: str = "whatsapp"
    created_at: datetime


def public_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "phone": user.get("phone", ""),
        "pincode": user.get("pincode", ""),
        "role": user.get("role", "member"),
        "created_at": aware(user["created_at"]),
    }


async def notify(user_id: str, kind: str, title: str, body: str, rental_id: str | None = None) -> None:
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "kind": kind,
        "title": title,
        "body": body,
        "channel": "whatsapp",
        "created_at": utcnow(),
    }
    if rental_id:
        doc["rental_id"] = rental_id
    await db.notifications.insert_one(doc)


# ---------- seeding ----------

async def seed_admin() -> None:
    email = os.environ.get("ADMIN_EMAIL", "admin@rentaread.in")
    password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "name": "RentARead Admin", "email": email,
            "password_hash": hash_password(password), "phone": "", "pincode": "560001",
            "role": "admin", "created_at": utcnow(),
        })
        logger.info("seeded admin %s", email)
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    app.state.seed_task = asyncio.create_task(seed_admin())
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ---------- auth routes ----------

@api_router.post("/auth/register", response_model=UserPublic)
async def register(body: RegisterRequest, response: Response):
    email = body.email.lower()
    if body.pincode not in SERVICEABLE_PINCODES:
        raise HTTPException(400, "We don't deliver to this pincode yet")
    if await db.users.find_one({"email": email}):
        raise HTTPException(409, "An account with this email already exists")
    user = {
        "id": str(uuid.uuid4()), "name": body.name, "email": email,
        "password_hash": hash_password(body.password), "phone": body.phone,
        "pincode": body.pincode, "role": "member", "created_at": utcnow(),
    }
    await db.users.insert_one(user)
    set_auth_cookies(response, user["id"], email)
    return UserPublic(**public_user(user))


@api_router.post("/auth/login", response_model=UserPublic)
async def login(body: LoginRequest, request: Request, response: Response):
    email = body.email.lower()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= MAX_ATTEMPTS:
        locked_until = aware(attempt["updated_at"]) + timedelta(minutes=LOCK_MINUTES)
        if utcnow() < locked_until:
            raise HTTPException(429, "Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"updated_at": utcnow()}},
            upsert=True,
        )
        raise HTTPException(401, "Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, user["id"], email)
    return UserPublic(**public_user(user))


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)):
    return UserPublic(**public_user(user))


@api_router.post("/auth/refresh", response_model=UserPublic)
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(401, "No refresh token")
    try:
        payload = jwt.decode(token, jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(401, "Invalid token type")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(401, "User not found")
    response.set_cookie("access_token", create_access_token(user["id"], user["email"]), httponly=True, secure=True, samesite="none", max_age=ACCESS_TOKEN_MINUTES * 60, path="/")
    return UserPublic(**public_user(user))


# ---------- pincode ----------

@api_router.get("/pincodes/check/{pincode}", response_model=PincodeCheck)
async def check_pincode(pincode: str):
    info = SERVICEABLE_PINCODES.get(pincode)
    if info:
        days = info["eta_days"]
        return PincodeCheck(
            pincode=pincode, serviceable=True, hub=info["hub"], city=info["city"], eta_days=days,
            message=f"We deliver to {info['hub']}, {info['city']} — books at your door in {days} day{'s' if days > 1 else ''}.",
        )
    return PincodeCheck(
        pincode=pincode, serviceable=False,
        message="We're not in your neighbourhood yet. We're expanding pincode by pincode — check back soon.",
    )


# ---------- books ----------

@api_router.get("/books", response_model=list[Book])
async def list_books(genre: str | None = None, q: str | None = None):
    query: dict = {}
    if genre:
        query["genre"] = genre
    if q:
        query["$or"] = [{"title": {"$regex": q, "$options": "i"}}, {"author": {"$regex": q, "$options": "i"}}]
    docs = await db.books.find(query, {"_id": 0}).to_list(500)
    return [Book(**d) for d in docs]


# ---------- subscriptions ----------

@api_router.post("/subscriptions", response_model=Subscription)
async def create_subscription(body: SubscriptionRequest, user: dict = Depends(get_current_user)):
    existing = await db.subscriptions.find_one({"user_id": user["id"], "status": "active"}, {"_id": 0})
    if existing:
        raise HTTPException(409, "You already have an active subscription")
    now = utcnow()
    sub = {
        "id": str(uuid.uuid4()), "user_id": user["id"], "plan": "Quarterly Reading Plan",
        "amount": PLAN_PRICE, "status": "active", "start_date": now,
        "end_date": now + timedelta(days=90), "current_cycle": 0,
        "books_rented_total": 0, "payment_method": body.payment_method, "created_at": now,
    }
    await db.subscriptions.insert_one(sub)
    await notify(
        user["id"], "subscription_started", "Subscription active",
        f"Welcome to RentARead, {user['name']}! Your Quarterly Reading Plan (₹{PLAN_PRICE:,}) is active. Pick your first 4 books now.",
    )
    sub.pop("_id", None)
    return Subscription(**sub)


@api_router.get("/subscriptions/me", response_model=Subscription | None)
async def my_subscription(user: dict = Depends(get_current_user)):
    sub = await db.subscriptions.find_one({"user_id": user["id"]}, {"_id": 0}, sort=[("created_at", -1)])
    return Subscription(**sub) if sub else None


# ---------- rentals ----------

@api_router.post("/rentals", response_model=Rental)
async def create_rental(body: RentalCreate, user: dict = Depends(get_current_user)):
    if len(body.book_ids) != BOOKS_PER_CYCLE or len(set(body.book_ids)) != BOOKS_PER_CYCLE:
        raise HTTPException(400, f"Select exactly {BOOKS_PER_CYCLE} different books")
    sub = await db.subscriptions.find_one({"user_id": user["id"], "status": "active"})
    if not sub:
        raise HTTPException(400, "You need an active subscription before ordering books")
    if sub["current_cycle"] >= CYCLES_PER_PLAN:
        raise HTTPException(400, "All 3 monthly cycles are used — renew your plan to continue")
    active = await db.rentals.find_one({"user_id": user["id"], "status": "delivered"})
    if active:
        raise HTTPException(409, "Return your current set before ordering the next one")
    books = []
    for bid in body.book_ids:
        book = await db.books.find_one({"id": bid})
        if not book:
            raise HTTPException(404, "Book not found")
        if book["copies_available"] < 1:
            raise HTTPException(409, f"'{book['title']}' is out on rent right now")
        books.append(book)
    now = utcnow()
    cycle = sub["current_cycle"] + 1
    rental = {
        "id": str(uuid.uuid4()), "user_id": user["id"], "subscription_id": sub["id"],
        "cycle": cycle, "book_ids": body.book_ids, "status": "delivered",
        "ordered_at": now, "due_date": now + timedelta(days=CYCLE_DAYS), "returned_at": None,
    }
    await db.rentals.insert_one(rental)
    for book in books:
        await db.books.update_one({"id": book["id"]}, {"$inc": {"copies_available": -1}})
    await db.subscriptions.update_one(
        {"id": sub["id"]},
        {"$set": {"current_cycle": cycle}, "$inc": {"books_rented_total": BOOKS_PER_CYCLE}},
    )
    titles = ", ".join(b["title"] for b in books)
    await notify(user["id"], "order_confirmed", f"Month {cycle} order confirmed", f"Packed and ready: {titles}. Covered by your plan — nothing to pay.")
    await notify(user["id"], "out_for_delivery", "Out for delivery", f"Your month {cycle} bundle is out for delivery to {user.get('pincode', '')}. Expected at your doorstep within 48 hours.")
    rental.pop("_id", None)
    return Rental(**rental, books=[Book(**b) for b in books])


@api_router.get("/rentals/me", response_model=list[Rental])
async def my_rentals(user: dict = Depends(get_current_user)):
    docs = await db.rentals.find({"user_id": user["id"]}).sort("ordered_at", -1).to_list(50)
    result = []
    for r in docs:
        books = await db.books.find({"id": {"$in": r["book_ids"]}}, {"_id": 0}).to_list(10)
        result.append(Rental(**r, books=[Book(**b) for b in books]))
    return result


@api_router.post("/rentals/{rental_id}/return", response_model=Rental)
async def return_rental(rental_id: str, user: dict = Depends(get_current_user)):
    rental = await db.rentals.find_one({"id": rental_id, "user_id": user["id"]})
    if not rental:
        raise HTTPException(404, "Rental not found")
    if rental["status"] == "returned":
        raise HTTPException(409, "This set has already been returned")
    now = utcnow()
    await db.rentals.update_one({"id": rental_id}, {"$set": {"status": "returned", "returned_at": now}})
    for bid in rental["book_ids"]:
        await db.books.update_one({"id": bid}, {"$inc": {"copies_available": 1}})
    await notify(user["id"], "pickup_complete", "Pickup complete", f"Month {rental['cycle']} books picked up from your doorstep. Thank you for reading with us!")
    if rental["cycle"] >= CYCLES_PER_PLAN:
        await db.subscriptions.update_one({"id": rental["subscription_id"]}, {"$set": {"status": "completed"}})
        await notify(user["id"], "renewal_reminder", "Time to renew", "Your 3-month plan is complete — 12 books devoured! Renew now to keep the stories coming.")
    else:
        await notify(user["id"], "next_cycle", "Pick your next 4", f"Month {rental['cycle'] + 1} is unlocked — choose your next 4 books and we'll bring them over.")
    rental["status"] = "returned"
    rental["returned_at"] = now
    rental.pop("_id", None)
    books = await db.books.find({"id": {"$in": rental["book_ids"]}}, {"_id": 0}).to_list(10)
    return Rental(**rental, books=[Book(**b) for b in books])


# ---------- notifications (mocked WhatsApp) ----------

@api_router.get("/notifications/me", response_model=list[AppNotification])
async def my_notifications(user: dict = Depends(get_current_user)):
    rental = await db.rentals.find_one({"user_id": user["id"], "status": "delivered"})
    if rental:
        due = aware(rental["due_date"])
        days_left = (due - utcnow()).days
        if days_left <= REMINDER_DAYS_BEFORE:
            existing = await db.notifications.find_one({"user_id": user["id"], "kind": "return_reminder", "rental_id": rental["id"]})
            if not existing:
                await notify(
                    user["id"], "return_reminder", "Return reminder",
                    f"Only {max(days_left, 1)} day{'s' if days_left != 1 else ''} left — keep your 4 books ready. Pickup is due {due.strftime('%d %b')}.",
                    rental_id=rental["id"],
                )
    docs = await db.notifications.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return [AppNotification(**d) for d in docs]


@api_router.get("/")
async def root():
    return {"message": "RentARead API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
