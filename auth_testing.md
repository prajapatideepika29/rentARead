# Auth Testing Playbook — RentARead

Auth is email/password JWT in httpOnly cookies (`access_token` 24h, `refresh_token` 7d), set by `/api/auth/login` and `/api/auth/register`.

## Credentials
See `/app/memory/test_credentials.md`. Admin is seeded idempotently at backend startup.

## MongoDB checks
```
mongosh
use app
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})   # bcrypt hash starts with $2b$
```
Indexes: users.email (unique), users.id (unique), login_attempts.identifier.

## API checks
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@rentaread.in","password":"admin123"}'
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Login returns the user object and sets both cookies; `/me` returns the same user from the cookie.

## Brute force
5 failed logins for the same ip:email locks the account for 15 minutes (HTTP 429).
