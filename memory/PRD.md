# RentARead — PRD

## Original problem statement
"Create a working website for the attached product document" — the document describes a localized book rental platform: pincode-gated access, quarterly (3-month) subscription at a fixed one-time price, 4 books/month (12 total), WhatsApp order confirmations + due-date reminders (day 27/29), return-and-swap monthly cycle, renewal or final return in month 3, and a user dashboard tracking current books and remaining quota.

## User personas
- Urban Indian reader (Bengaluru/Mumbai/Delhi/Hyderabad/Pune) who wants a library habit without buying or late fees
- Member managing monthly book cycles and returns from the dashboard

## Architecture
- FastAPI + MongoDB (motor) backend at `/app/backend/server.py`; httpOnly-cookie JWT auth (bcrypt, PyJWT, 5-attempt/15-min brute-force lockout); catalog seeded by `backend/seed.py` (idempotent, 26 books, Open Library covers)
- Vite + React 19 + TS frontend; TanStack Query; `motion` for reveals/parallax; `lenis` smooth scroll; warm editorial parchment theme (Lora/Playfair/DM Sans, terracotta #9A3412)

## Core requirements (static)
FR-01 pincode access control · FR-02 3-month subscription mgmt · FR-03 inventory tracking · FR-04 WhatsApp messaging · FR-05 user dashboard

## Implemented (24 Sep 2026)
- Landing page: kinetic masked-reveal hero w/ parallax, pincode checker, editorial marquee, how-it-works, bento perks, ₹1,499 pricing, footer pincode directory
- Auth: register (pincode-validated), login, logout, /me, refresh; admin seeded (admin@rentaread.in)
- Catalog: 26 books, genre filters, search, 4-book bundle with floating dock + cross-page persistence
- Subscription: mocked UPI/Card checkout → instant active plan
- Rentals: order 4 books (copies decrement), 30-day due date, return/swap unlocks next cycle, cycle 3 completes plan
- Dashboard: quota badge, current rack + countdown, return reminder (≤3 days), plan timeline, rental history, simulated WhatsApp log (subscription/order/dispatch/reminder/pickup/renewal lifecycle)
- WhatsApp integration: MOCKED (in-app log + toasts). Payments: MOCKED.

## Implemented (27 Sep 2026)
- Production-readiness scan: passed clean (env hygiene, CORS, idempotent seeding, query limits, supervisor config)
- Password reset via email: Emergent-managed Resend — forgot-password (1h single-use tokens, account-existence-safe responses, guardrail-gated branded template), reset-password; verified live (email accepted by proxy, token reset → login, reuse blocked)
- Mobile UX: hamburger menu with all nav links + auth actions; hash links (#how/#pricing) smooth-scroll
- Toys vertical placeholder: "Books today. Toys tomorrow." section with a real waitlist (POST /api/waitlist, email+pincode, duplicate-safe)

## Implemented (27 Sep 2026 — kid-friendly retheme)
- Whole-site storybook pastel retheme (design_guidelines.json v2): cream #FDFBF7 canvas, sky blue #0284C7 primary, leaf green #16A34A, sunny #F59E0B, navy ink #0F172A; Poppins display/headings + DM Sans body
- Light hero with pastel blobs, sticker badges, wiggly underline, kids-reading photo card, 5-star family badge; wave divider; colorful numbered step cards; bento + pricing refreshed; white glass bundle dock
- Copy re-toned to upbeat family voice ("As easy as story time", "The Toy Trunk", pizza-night pricing)
- All routes, endpoints, testids, and flows unchanged; typecheck clean

## Implemented (27 Sep 2026 — kids' catalogue + reading badges)
- Seeded 20 real children's books with covers (Open Library ISBNs): 5 board books (2–4), 6 early readers (5–7), 5 chapter books (8–10), 4 young adult (11–14); the 26 existing titles tagged Grown-ups — 46 total
- age_group on the Book model; catalogue has a sunny age-group filter ribbon (client-side, alongside genre + search) and age tags on every book card
- GET /api/badges/me computes 5 milestone badges from real rental activity (First Box, Book Explorer, Super Explorer, Genre Hopper, Right on Time); dashboard shows a bouncy badges card with earned/locked states
- Cover fallback now also catches Open Library's 1×1 blank-image responses

## Implemented (28 Sep 2026 — modern SaaS retheme)
- Whole-site redesign v3 (design_guidelines.json v3): Modern Light SaaS + soft mesh gradients — crisp white/slate-50 canvas, hairline borders, single blue accent #2563EB, glassmorphism cards, Plus Jakarta Sans display + Instrument Sans body + Geist Mono data
- New hero: mesh-gradient canvas, gradient headline accent, glass "this month's box" preview card with parallax, rating chip; dark glass bundle dock; dark genre chips on book cards; modern rounded-xl buttons throughout
- Family-friendly copy retained; kids' catalogue, badges, waitlist, auth, and all flows unchanged; typecheck clean

## Implemented (28 Sep 2026 — child profiles)
- Parents manage up to 6 reader profiles (name + age band) from a "Your little readers" dashboard card: add, list with color-coded initials, delete (PATCH endpoint also available)
- Catalog "Reading for" switcher: picking a child snaps the catalogue to their age band and persists the choice; orders placed while a child is selected are attributed to them (rentals.child_id, validated server-side)
- Badges compute per child: GET /api/badges/me?child_id= filters rental history; dashboard badges card has a Whole family / per-child scope selector
- Verified live: add child, invalid age rejected (400), order attributed to Kabir (cycle 2), per-child vs family badges diverge correctly, fake child_id rejected (404), Kabir's "Right on Time" earned on return

## Backlog
- P0: Real WhatsApp Business API; real payment gateway (Stripe/Razorpay)
- P1: Scheduled day-27/29 reminder worker; pickup scheduling UI; address management
- P2: Admin inventory console; waitlist for unserviceable pincodes; reading stats/streaks
