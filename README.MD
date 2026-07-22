# RentIt Backend (name pending) — Equipment Rental Marketplace MVP

Node.js + Express + TypeScript backend for the capstone project. This README is written for the whole backend team, including anyone less familiar with parts of the stack — read it before you start picking up an endpoint.

## Stack

| Concern | Choice |
|---|---|
| Runtime / framework | Node.js + Express 5 (TypeScript) |
| Database / ORM | PostgreSQL + Sequelize |
| Auth | JWT (access + refresh) + bcrypt |
| Cache / queues | Redis + BullMQ |
| Image storage | Cloudinary |
| Payments | Paystack (primary), Flutterwave (backup) |
| Location | Google Maps API |
| Email / push | Resend, Firebase Cloud Messaging |

## Project structure

```
src/
  config/         # env validation, DB, Redis, Cloudinary connections
  models/         # Sequelize models — one file per entity + index.ts for associations
  repositories/    # DB access ONLY. One per entity, extends BaseRepository
  services/        # business logic. Calls repositories, queues, external APIs
  controllers/     # req/res handling ONLY. Calls services, never a model/repository directly
  routes/v1/       # one file per resource, mounted in routes/index.ts
  middlewares/     # auth, validation, error handling, file upload
  validators/      # Zod schemas per resource
  jobs/            # BullMQ queues + workers (background jobs: email, push, etc.)
  utils/           # AppError, asyncHandler, jwt helpers, response shape
  app.ts           # Express app wiring (middleware, routes, error handler)
  server.ts        # boot: connect DB, sync/migrate, start listening
```

## The pattern: Repository → Service → Controller → Route

Every resource follows the same four-layer flow. **Auth and User are fully built — read those first, they're the reference implementation for everything else:**

- `src/repositories/user.repository.ts`
- `src/services/auth.service.ts` / `src/services/user.service.ts`
- `src/controllers/auth.controller.ts` / `src/controllers/user.controller.ts`
- `src/routes/v1/auth.routes.ts` / `src/routes/v1/user.routes.ts`

**Rules:**
1. **Routes** define the path, apply middleware (`requireAuth`, `requireRole('admin')`, `validate(schema)`, `upload`), and call one controller method. No logic here.
2. **Controllers** pull data off `req`, call **one** service method, and send the response with `sendSuccess()`. No Sequelize, no business logic.
3. **Services** hold the business logic. They call repositories (and other services, queues, Cloudinary, payment providers). They throw `AppError` for anything that isn't a 200.
4. **Repositories** are the only place that imports a Sequelize model. If you need a new query (a filter, a join, a geo search), add a method to the repository — don't reach for the model in a service.

## How to pick up a resource

Every domain from the endpoints doc already has:
- a working repository in `src/repositories/`
- a route file in `src/routes/v1/` with **every endpoint already wired up**, guarded with the correct auth/admin middleware, returning `501 Not Implemented`

To build one out:
1. Open the route file for your resource (e.g. `src/routes/v1/booking.routes.ts`).
2. Write `src/validators/<resource>.validator.ts` (Zod schemas for the request body/query).
3. Write `src/services/<resource>.service.ts` (business logic, using the existing repository).
4. Write `src/controllers/<resource>.controller.ts` (thin req/res layer).
5. In the route file, swap the `notImplemented('...')` call for your real controller method, and add `validate(schema)` where there's a body.

Don't create a parallel repository/service file for something that already exists — extend it.

## Endpoint status

| Domain | Status |
|---|---|
| Auth | ✅ Fully implemented |
| User Profile | ✅ Fully implemented |
| Everything else in `docs/API_ENDPOINTS.md` | 🔲 Routed + guarded, returns `501` — ready to be built |

## Data model

All 16 tables from the endpoint doc are modeled in `src/models/` with associations centralized in `src/models/index.ts`. Key judgment call: **`role` on `User` is just `user` / `admin`** — anyone can list equipment (as an owner) and book equipment (as a renter) on the same account, like Airbnb hosts/guests. Owner vs. renter is determined per-resource (`Equipment.ownerId`, `Booking.renterId`), not by account type. Flag it in standup if the product spec expects something different.

## Getting started

```bash
git clone <repo-url>
cd trustlend-backend
cp .env.example .env      # fill in your local DB/Redis/API keys
npm install
npm run dev                # starts the API with hot reload
npm run worker:dev         # (separate terminal) starts the BullMQ worker for emails/jobs
```

Requires locally running PostgreSQL and Redis (or point `.env` at hosted ones). In development, `server.ts` calls `sequelize.sync({ alter: true })` automatically — no manual migration needed while the schema is still moving. Once the schema stabilizes, switch to real migrations:

```bash
npm run db:migrate
```

### Environment variables
See `.env.example` for the full list. Ask in the team channel for shared dev keys (Cloudinary, Paystack test keys, Resend, Firebase service account) rather than committing your own — **never commit `.env` or `firebase-service-account.json`.**

## Conventions

- **Response shape** — every success response looks like:
  ```json
  { "success": true, "message": "...", "data": { ... } }
  ```
  Errors:
  ```json
  { "success": false, "message": "..." }
  ```
- **Errors** — throw `AppError` (or its static helpers `AppError.notFound()`, `AppError.badRequest()`, etc.) from a service/controller. Never throw a plain `Error` — the global error handler won't know the right status code.
- **Async routes** — always wrap controller methods in `asyncHandler(...)` in the route file so thrown errors reach the error middleware instead of crashing the process.
- **Validation** — validate `req.body`/`req.query`/`req.params` with a Zod schema via the `validate()` middleware before the controller runs.
- **IDs** — UUIDs everywhere (`DataTypes.UUIDV4`), not auto-increment integers.
- **Money** — `DECIMAL(12, 2)`, never `FLOAT`.
- **Full file contents** — when asking Claude (or anyone) for help on a file, ask for the complete updated file, not a diff, to keep things unambiguous across the team.

## Background jobs (BullMQ)

Queues are defined in `src/jobs/queue.ts`. Add a job from a **service** (not a controller) with:
```ts
await notificationQueue.add('send-email', { type: 'verifyEmail', ... }, defaultJobOptions);
```
Workers that process jobs live in `src/jobs/workers/`. Run them with `npm run worker:dev` in a separate process from the API server — they don't run automatically inside `npm run dev`.

## What's NOT decided yet (flag these before building the related endpoint)

- Exact platform fee / commission percentage (affects `Earning.platformFee` calculation)
- Deposit hold/release business rules (e.g. auto-release window after booking completion)
- Whether booking date-range availability is checked live against Redis cache or a straight DB query on `AvailabilityBlock` + existing `Booking`s
- Paystack vs. Flutterwave selection logic (user choice at checkout? auto-fallback if Paystack fails?)
- Push notification (FCM) payload conventions — device token storage isn't modeled yet; add a `DeviceToken` model when that's picked up