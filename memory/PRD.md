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

## Backlog
- P0: Real WhatsApp Business API; real payment gateway (Stripe/Razorpay)
- P1: Scheduled day-27/29 reminder worker; pickup scheduling UI; address management
- P2: Admin inventory console; waitlist for unserviceable pincodes; reading stats/streaks
