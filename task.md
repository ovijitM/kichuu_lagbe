# Kichuu Lagbe — Full Project Tasks

Residential community super app for **Bashundhara R/A, Dhaka**.

| | |
|---|---|
| Brand | **Kichuu Lagbe** — wordmark `KICHUU LAGBE ?`, tagline `Crave more! Till four` |
| Logo | `resources/a78ab9db-f49a-471e-9aed-94000d381047-removebg-preview.png` |
| Stack | MongoDB, Express, React (Vite), Node. One web app, role-based routes |
| Launch area | Bashundhara Residential Area only |
| Design source | `resources/stitch_hyperlocal_residential_community_super_app/` and `hyperlocal_community_pulse/DESIGN.md` |
| Product source | `resources/Project_Plan.md` |

Stitch HTML is a visual reference. Do not ship those files as the app. Replace the placeholder name **ParaPulse** with **Kichuu Lagbe** everywhere in the product.

Money is **BDT (৳)**. The Stitch cart copy that shows dollars is a placeholder.

Check a box only when the task is implemented, reviewed, and runnable. `[~]` means in progress.

---

## Decisions locked for this build

- [ ] MERN web app for all five roles. Native Flutter/React Native apps are not in this backlog.
- [ ] Express, not NestJS. MongoDB, not PostgreSQL.
- [ ] Temporary email and password login/signup. Seed account credentials live in `server/.env`. The production login system (phone OTP) replaces this later. Admin cannot self-register.
- [ ] Cash on delivery is the launch payment method. Online gateway is a later integration behind the same payment record.
- [ ] Order tracking is status-based. Live GPS is Phase 2.
- [ ] Medicines stay behind a compliance flag and are off until licensing is confirmed. Do not seed Napa/Paracetamol as a sellable item.
- [ ] Launch zone is a single area record: Bashundhara R/A, blocks as address data, not multi-area tenancy.

---

## Roles

| Role | Home | Stitch screen |
|---|---|---|
| Resident | `/` | Resident hub, Instant Mart, Home services |
| Shop owner | `/merchant` | Merchant shop owner dashboard |
| Service provider | `/provider` | No dedicated screen yet. Build from the services flow in the plan |
| Rider | `/rider` | No dedicated screen yet. Build from the delivery flow in the plan |
| Admin | `/admin` | Admin dispatch operations console |

---

## Phase 0 — Foundation

Current build. Empty shells only. No catalog, cart, or order behavior yet.

### Repo and runtime

- [ ] Root npm workspaces: `client` (Vite + React) and `server` (Express)
- [ ] `npm run dev` starts API on port 5000 and web on port 5173
- [ ] Vite proxies `/api` to the API
- [ ] `.env.example` with `MONGODB_URI=mongodb://127.0.0.1:27017/kichuu_lagbe`
- [ ] `docker-compose.yml` for local MongoDB
- [ ] `.gitignore` for `node_modules`, `.env`, build output
- [ ] README with install, seed, and dev-login steps

### Design system

Tokens come from `DESIGN.md`. Use them in Tailwind, not one-off hex values in components.

- [ ] Primary emerald `#059669`, secondary teal `#10B981`, tertiary amber `#F59E0B`
- [ ] Canvas `#F8FAFC`, cards `#FFFFFF`, text slate `#0F172A`
- [ ] Plus Jakarta Sans for headlines, Inter for body and numbers
- [ ] Tabular numbers on prices, ETAs, and KPIs
- [ ] Radii: 8px controls, 16px large surfaces, full pills for badges
- [ ] Card, floating, and modal shadows from the design doc
- [ ] Logo in `client/public`, used on login and shells
- [ ] Shared button, badge, input, and empty-state components

### Auth and access

Temporary email and password auth. Replace it when the real login system is built.

- [x] `POST /api/auth/signup` — email, password, name, and role. Admin cannot self-register
- [x] `POST /api/auth/login` — email and password, returns a JWT
- [x] Seed account emails and passwords come from `server/.env`, not from source code
- [x] `GET /api/auth/me`
- [x] `protect` and `requireRole` middleware
- [x] Helmet, CORS limited to the Vite origin, Zod on auth bodies
- [x] Login and signup screens
- [x] After login, send the user to their role home
- [x] Wrong-role routes redirect home. Logged-out routes redirect to `/login`

### Data models

Schemas and indexes only. No feature controllers beyond auth and health.

- [ ] `GET /api/health`
- [ ] **User** — email unique, password hash, name, role, status `pending | active | suspended`
- [ ] **Address** — block, road, building, apartment, gate PIN, default flag
- [ ] **Shop** — owner, name, block, open flag, approval status
- [ ] **Category** — name, kind `product | service`
- [ ] **Product** — shop, category, name, price in BDT, stock, active flag
- [ ] **Order** — resident, shop, lines, address snapshot, totals, payment method `cod | online`
- [ ] Order status: `placed → shop_confirmed → rider_assigned → picked_up → delivered`, or `cancelled`
- [ ] **ServiceProvider** — user, categories, verified flag, base price
- [ ] **Booking** status: `requested → accepted | rejected → completed | cancelled`
- [ ] **RiderProfile** — user, availability, vehicle
- [ ] **Notification** — user, title, body, read flag
- [ ] Seed: one active user per role, one approved shop, a few grocery products, one verified electrician, no orders

### Role shells

Nav and page frame only. Body copy says what the next sprint fills in.

- [ ] Resident shell: Resident Hub, Instant Mart, Home Services
- [ ] Merchant shell
- [ ] Provider shell
- [ ] Rider shell
- [ ] Admin shell with a 260px desktop nav spine

**Gate:** `npm run dev` serves login and five shells against a seeded database. A resident token cannot open `/admin`.

---

## Phase 1 — MVP

Sprints follow `resources/Project_Plan.md`. Each sprint should end with the flow usable in the browser against the API.

### Sprint 1 — Shops and catalog

- [ ] Shop registration for a `shop_owner` account. New shops start `pending`
- [ ] Admin approves or rejects a shop. Rejected shops stay hidden from residents
- [ ] Shop profile: name, block, open/closed, prep-time minutes
- [ ] Product categories for grocery, water, household, snacks, toiletries, baby
- [ ] Merchant creates, edits, and archives products (name, price, unit, stock, photo, category)
- [ ] Stock cannot go below zero. Out-of-stock products stay visible and cannot be added to a cart
- [ ] Merchant fast stock toggle: in stock, low, out (matches the inventory panel)
- [ ] Resident-facing shop list limited to approved, open shops in Bashundhara

### Sprint 2 — Resident hub and Instant Mart

Match the resident hub and Instant Mart screens.

- [ ] Hub greeting, saved address (block, road, apartment), and 20–30 min zone badge
- [ ] Three entry tiles: Instant Mart, local shops, home technicians
- [ ] Active order tracker shell (empty until Sprint 3 has a live order)
- [ ] Popular-in-block product row from real catalog data
- [ ] Instant Mart: shop picker, category pills, search
- [ ] Product cards with photo, BDT price, stock, and inline +/− quantity
- [ ] Cart stored per resident. One shop per cart. Switching shops asks for confirmation to clear the cart
- [ ] Sticky cart: lines, address, delivery window, subtotal, delivery fee, total
- [ ] Empty, loading, and error states for catalog and cart

### Sprint 3 — Checkout and orders

- [ ] Address book. Default address required before checkout. Fields: block, road, building, apartment, gate PIN
- [ ] Checkout creates an order in `placed`, snapshots address and prices, decrements stock
- [ ] If stock changed since the cart was built, checkout fails with the items that failed
- [ ] Payment method on the order: COD now. Online is shown as unavailable
- [ ] Resident order history and order detail with the four status steps from the hub tracker
- [ ] Merchant live board: incoming, packing, handed to rider
- [ ] Merchant confirms or rejects before a timeout. Reject or timeout cancels the order and restores stock
- [ ] Basic in-app notification records for new order, confirmed, and cancelled

### Sprint 4 — Riders and instant delivery

- [ ] Rider profile: vehicle, availability toggle
- [ ] Admin assigns an available rider to a confirmed order. Status becomes `rider_assigned`
- [ ] Rider sees assigned jobs only: accept, mark picked up, mark delivered
- [ ] Resident tracker advances on those status changes
- [ ] Failure path: rider declines or does not accept in time, admin can reassign, stock stays decremented until cancel
- [ ] Cancel before pickup restores stock. Cancel after pickup is an admin action with a reason
- [ ] Delivery fee and commission amounts stored on the order from admin-configured rates
- [ ] Earnings rows for shop and rider when status becomes `delivered` (no payout transfer yet)

### Sprint 5 — Payments and notifications

- [ ] COD marked collected by the rider at delivery
- [ ] Payment record per order: method, amount, status `pending | collected | failed | refunded`
- [ ] Admin refund on a cancelled paid order (status only in MVP)
- [ ] Notification list in each shell, mark read
- [ ] SMS and push are interfaces behind a provider module. Dev provider writes to the server log
- [ ] Document the real SMS and gateway env vars without calling them

### Sprint 6 — Home services

Match the household services screen and add the provider side.

- [ ] Service categories: AC, electrician, plumber, cleaning, appliance repair, carpenter, painting, emergency handyman
- [ ] Provider application: categories, base price, bio. Admin verifies before the provider is public
- [ ] Resident browse: category grid, provider cards (rating, price, arrival window, verified badge)
- [ ] Booking wizard: describe the job, optional photo, time window (emergency / today / tomorrow), address and gate PIN, price breakdown, confirm
- [ ] Provider inbox: accept or reject. Accept sets the visit time. Reject returns the resident to browse
- [ ] Status path through to completed. Resident can rate 1–5 after completion
- [ ] Provider earnings row on completion, commission deducted in the stored amounts
- [ ] Complaint record linked to a booking, visible to admin

### Sprint 7 — Admin dispatch

Match the admin console, using status data rather than a live map.

- [ ] KPI strip: active orders, unassigned orders, riders on duty, open bookings, pending approvals
- [ ] Zone note fixed to Bashundhara R/A. Block filter on orders
- [ ] Live order feed with assign-rider action
- [ ] Technician job feed
- [ ] Approval queue: shops, providers, riders
- [ ] User suspend and reactivate
- [ ] Commission and delivery-fee settings
- [ ] Review and complaint list
- [ ] Broadcast notification to active residents in the zone (stored notifications, no SMS blast)
- [ ] Simple reports: orders today, delivered within 30 minutes, cancellation count, gross commission

### Sprint 8 — Hardening

- [ ] API tests for pricing, stock decrement, order transitions, and role guards
- [ ] Resident, merchant, and admin flows checked in the browser on a desktop width and a phone width
- [ ] Auth, IDOR, and role checks reviewed on orders, bookings, and earnings
- [ ] Indexes on phone, order status, shop approval, and booking status
- [ ] Seed script is safe to re-run
- [ ] README covers env, seed phones, and what is deliberately not built

**MVP gate:** a resident can order groceries COD and book a verified provider; the shop, rider, and provider can move their statuses; admin can approve supply and see the day’s orders. No critical broken path in those flows.

---

## Phase 1b — Pilot readiness

Not feature work. Do these before inviting real Bashundhara residents.

- [ ] Terms, privacy, refund, and cancellation pages
- [ ] Support path: complaint from an order or booking, admin can mark resolved
- [ ] Backup note for MongoDB and a restore check
- [ ] Error logging on the API
- [ ] Load check on browse and checkout with the launch catalog size
- [ ] Launch checklist from the project plan: shops in the main categories, riders per shift, verified providers, COD reconciliation, support hours

---

## Phase 2 — After pilot data

Build only what pilot usage justifies. Listed so the MVP schema does not block them.

- [ ] Live rider location and resident map
- [ ] Replace temporary email/password auth with phone OTP, and add push notifications
- [ ] SSLCommerz (or the chosen gateway): bKash, Nagad, cards. COD stays
- [ ] Coupons, referral codes, and admin banners
- [ ] Resident wallet and loyalty points
- [ ] Shop subscription and featured placement
- [ ] Rider auto-assign by availability and current load
- [ ] Payout batches and a finance export
- [ ] Analytics beyond the MVP daily counts

---

## Phase 3 — Expansion

- [ ] Multiple residential areas, each with its own shops, riders, fees, and catalog
- [ ] Admin permissions scoped to an area
- [ ] Batching and coverage-zone rules
- [ ] Community notices and resident groups (the hub notice board becomes real)
- [ ] Group-buy offers, if the hub banner is still wanted after launch
- [ ] Playbook checklist for opening a second area

---

## Explicitly out of scope until the phase above

- Native iOS/Android apps
- Live GPS in the MVP
- Medicine catalog
- AI support, demand forecasting, automated onboarding
- Wallet, loyalty, and vendor subscriptions in the MVP

---

## Suggested build order

1. Phase 0 foundation (this setup)
2. Sprint 1 catalog, because every later screen reads it
3. Sprint 2 and 3 so a resident can place an order
4. Sprint 4 so that order can be delivered
5. Sprint 6 services in parallel with Sprint 5 once orders work
6. Sprint 7 admin completes the MVP
7. Sprint 8 before any pilot
