# Working On Your Module (With or Without AI)

This is for whoever's picking up a domain from `docs/API_ENDPOINTS.md`. Read this before you open an AI chat or write a line of code — it'll save you from merge conflicts and from building something that quietly breaks someone else's module.

## 1. The rule that matters most: stay in your lane

Every domain already has:
- a **repository** in `src/repositories/<domain>.repository.ts` (already extends `BaseRepository`, works out of the box)
- a **route file** in `src/routes/v1/<domain>.routes.ts` with every endpoint already wired up, guarded with the right `requireAuth`/`requireRole('admin')`, returning `501 Not Implemented`

Your job is to add two files (`src/services/<domain>.service.ts`, `src/controllers/<domain>.controller.ts`) and swap the `501` stubs in your route file for real controller calls.

**Don't touch:**
- other people's route/service/controller files
- `src/models/` or `src/models/index.ts` (if you need a new field or association, ask in the team channel first — a schema change affects everyone)
- `src/app.ts`, `src/server.ts`, `src/config/*` (shared infrastructure)

If your module genuinely needs something from someone else's domain (e.g. Damage Claims needs to read a `Deposit`), it's fine to **import their repository and read from it** — repositories are shared, read-only-in-practice building blocks. Just don't write to another domain's table unless you've agreed on that with whoever owns it.

## 2. Before you start: sync and branch

```bash
git pull origin main
git checkout -b feature/<your-domain>   # e.g. feature/disputes
```

Work only inside your assigned files. Small, frequent commits ("disputes: create endpoint", "disputes: admin resolve endpoint") make it much easier for the team lead to review and merge without conflicts.

## 3. The four-file pattern

Look at an already-built module as your reference before asking AI for anything — **Payments, Deposits, and Damage Claims are fully built** in the repo right now and follow the exact same shape every other module should:

```
src/validators/<domain>.validator.ts    — Zod schemas for request body/query/params
src/services/<domain>.service.ts        — business logic, throws AppError, calls repositories
src/controllers/<domain>.controller.ts  — req/res only, calls one service method, uses sendSuccess()
src/routes/v1/<domain>.routes.ts        — already exists; swap notImplemented(...) for your controller method
```

Rules baked into every existing module, keep following them:
- Throw `AppError` / its static helpers (`AppError.notFound()`, `AppError.badRequest()`, etc.) — never a plain `Error`.
- Wrap every controller in `asyncHandler(...)` in the route file.
- Validate `req.body`/`req.query`/`req.params` with `validate(schema)` before the controller runs.
- Success responses go through `sendSuccess(res, { message, data, meta? })`.
- Money fields are numbers backed by `DECIMAL(12,2)` in the DB — don't introduce floats.

## 4. If you're using AI (Claude, ChatGPT, Copilot, whatever)

AI is genuinely useful here **if you give it the right context** — the biggest risk is it inventing its own patterns (different response shape, different error handling, a parallel repository) that don't match the rest of the codebase. Feed it context, don't just describe the task in the abstract.

### What to paste into the chat before asking for code

1. **Your assigned endpoints** — copy your section straight from `docs/API_ENDPOINTS.md`.
2. **One finished module as the pattern to copy** — paste all four files from `src/{validators,services,controllers,routes/v1}/payment.*` (or `deposit.*`, or `damageClaim.*`). This is the single highest-value thing you can give it — AI is very good at matching an established pattern and much worse at inventing a consistent one from scratch.
3. **The relevant model(s)** from `src/models/` — whatever tables your domain touches.
4. **`src/repositories/base.repository.ts`** and your own already-scaffolded `src/repositories/<domain>.repository.ts` — so it knows what's already available and doesn't recreate it.
5. **Your current stub route file** — `src/routes/v1/<domain>.routes.ts` — so it edits the real thing instead of guessing at paths/middleware.

### A prompt template that works well

```
I'm building the <Domain> module for a Node/Express/TypeScript/Sequelize backend.
It must follow the exact same repository → service → controller → route pattern
already used in this codebase. I'm pasting a finished reference module (Payments),
the relevant Sequelize model(s), the base repository, my domain's repository
(already done), and my current stub route file.

Build:
- src/validators/<domain>.validator.ts (Zod)
- src/services/<domain>.service.ts (business logic, throw AppError, use the
  existing repository — don't reinvent it)
- src/controllers/<domain>.controller.ts (thin req/res layer, use sendSuccess)
- an updated src/routes/v1/<domain>.routes.ts with the 501 stubs replaced

Match the existing code's conventions exactly: error handling style, response
shape, comment style for flagging assumptions. Give me full file contents, not
diffs. If a business rule isn't fully specified (e.g. exactly when an action
is allowed), make a reasonable assumption and flag it clearly in a comment —
don't just guess silently.

[paste: my endpoints from API_ENDPOINTS.md]
[paste: payment.validator.ts / payment.service.ts / payment.controller.ts / payment.routes.ts]
[paste: relevant model(s) from src/models/]
[paste: base.repository.ts]
[paste: my <domain>.repository.ts]
[paste: my current <domain>.routes.ts stub]
```

### After AI gives you code

1. **Ask for full file contents, not diffs** — it's already in the prompt above, but it's worth repeating: full files are unambiguous, diffs against a file the AI can't see are a common source of subtle breakage.
2. Save the files, then run:
   ```bash
   npx tsc --noEmit
   ```
   Zero errors before you move on. Fix anything it flags — don't ask the AI to "just suppress the error" with an `any` cast unless you understand why it happened.
3. Actually run the server (`npm run dev`) and hit your endpoints (Postman/Thunder Client/curl) against a real local Postgres — a clean typecheck does not mean the logic is right.
4. Re-read the assumptions the AI flagged in comments. If something doesn't match what you understood the business rule to be, say so and get it corrected — don't ship a guess you haven't checked.
5. Commit, push your branch, open a PR against `main` for review.

## 5. Cross-module coordination

A few things already flagged as `// TODO` in the code, because they touch a module someone else owns:
- Payments → **Owner Earnings**: a successful rental payment should eventually create an `Earning` record. Not built into Payments — that's Oliver's module.
- Damage Claims → **Owner Earnings**: an approved claim should credit the owner. Same story.

If you hit one of these TODOs while building your module, don't silently implement the other person's table — flag it in standup and let them wire the hook on their end.

## 6. Quick checklist before you open a PR

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] You only added/changed files inside your domain (validators/services/controllers + your one route file)
- [ ] Every endpoint from your section of `docs/API_ENDPOINTS.md` is implemented, not just some of them
- [ ] You tested each endpoint against a real running server, not just a typecheck
- [ ] Any business-rule assumption you (or the AI) made is commented clearly in the code
- [ ] Response shape matches `{ success, message, data }` on success and the global error middleware on failure — you didn't invent a different shape
