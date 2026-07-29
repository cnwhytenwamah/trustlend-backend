# Manual Postman Setup — Payments, Deposits, Damage Claims, Admin Users, Analytics

This walks through building all 25 requests by hand inside your existing "TrustLend" collection — no import file, just the exact clicks and values.

---

## Part 1 — Environment variables

Open your environment (the eye icon → your environment → **Edit**, or **Environments** in the sidebar). Add these variables. Leave the **Current Value** column blank for now except `baseUrl` — you'll fill the rest in after running the seed script in Part 2.

| Variable | Initial value | Type |
|---|---|---|
| `baseUrl` | `http://localhost:5000/api/v1` | default |
| `accessToken` | *(blank)* | secret |
| `ownerAccessToken` | *(blank)* | secret |
| `adminAccessToken` | *(blank)* | secret |
| `paystackSecretKey` | *(blank — same value as `PAYSTACK_SECRET_KEY` in your `.env`)* | secret |
| `bookingIdAccepted` | *(blank)* | default |
| `bookingIdCompleted` | *(blank)* | default |
| `seedPaymentId` | *(blank)* | default |
| `seedDepositId` | *(blank)* | default |
| `renterUserId` | *(blank)* | default |
| `ownerUserId` | *(blank)* | default |
| `paymentId` | *(blank)* | default |
| `lastPaymentReference` | *(blank)* | default |
| `depositId` | *(blank)* | default |
| `damageClaimId` | *(blank)* | default |

Set `type: secret` for tokens/keys so Postman masks them in the UI — doesn't change how they work, just hides the value on screen.

---

## Part 2 — Get test data (unblocks Payments/Deposits/Damage Claims)

These three modules all need a `Booking` to exist first, and Bookings isn't built yet. Instead of waiting, run a seed script that inserts test data directly:

1. Save `seedTestData.ts` (from the previous message) into your project's `scripts/` folder.
2. Add this line to `package.json` under `"scripts"`:
   ```json
   "seed:test-data": "ts-node scripts/seedTestData.ts"
   ```
3. Run:
   ```bash
   npm run seed:test-data
   ```
4. It prints something like:
   ```
   accessToken       (renter) : eyJhbGciOi...
   ownerAccessToken  (owner)  : eyJhbGciOi...
   adminAccessToken  (admin)  : eyJhbGciOi...

   bookingIdAccepted  : 3f2a1c...
   bookingIdCompleted : 9b7e44...
   seedPaymentId      : 1a2b3c...
   seedDepositId      : 4d5e6f...
   renterUserId       : 7g8h9i...
   ownerUserId        : 0j1k2l...
   ```
5. Copy each value into the matching environment variable in Postman (Part 1's table) and hit **Save**.

You can re-run this script any time you need a fresh, unused `held` deposit (e.g. after testing Release or Refund, which change its status).

---

## Part 3 — Building each request

For every request below: **New → HTTP Request** inside your collection, set the method + URL, then follow the Auth/Body/Tests instructions.

### Folder: 1. Payments

#### 1.1 Initialize Payment
- **Method:** `POST`
- **URL:** `{{baseUrl}}/payments/initialize`
- **Authorization tab:** Type = `Bearer Token`, Token = `{{accessToken}}`
- **Body tab:** select `raw`, dropdown = `JSON`, paste:
  ```json
  {
    "bookingId": "{{bookingIdAccepted}}",
    "type": "rental_and_deposit"
  }
  ```
- **Tests tab** (this captures the response for the next request):
  ```javascript
  const json = pm.response.json();
  if (json.success) {
      pm.environment.set('paymentId', json.data.paymentId);
      pm.environment.set('lastPaymentReference', json.data.reference);
  }
  ```
- Send it. You should get `201` with `authorizationUrl`, `accessCode`, `reference`.

#### 1.2 Simulate Paystack Webhook
- **Method:** `POST`
- **URL:** `{{baseUrl}}/payments/webhook`
- **Authorization tab:** No Auth (Paystack calls this directly, unauthenticated — signature verification replaces auth here)
- **Body tab:** `raw` / `JSON`:
  ```json
  {
    "event": "charge.success",
    "data": {
      "reference": "{{lastPaymentReference}}",
      "amount": 13000000,
      "status": "success"
    }
  }
  ```
- **Pre-request Script tab** (this is the important part — it signs the request the way Paystack would):
  ```javascript
  const body = pm.request.body.raw;
  const secret = pm.environment.get('paystackSecretKey');
  const hash = CryptoJS.HmacSHA512(body, secret).toString(CryptoJS.enc.Hex);
  pm.request.headers.upsert({ key: 'x-paystack-signature', value: hash });
  ```
- Send it. Expect a bare `200`. If you get `401 Invalid webhook signature`, double check `paystackSecretKey` in your environment exactly matches `PAYSTACK_SECRET_KEY` in the server's `.env`.

#### 1.3 Get Payment by ID
- **Method:** `GET`
- **URL:** `{{baseUrl}}/payments/{{paymentId}}`
- **Authorization tab:** Bearer Token = `{{accessToken}}`

#### 1.4 My Payments
- **Method:** `GET`
- **URL:** `{{baseUrl}}/payments/my?page=1&limit=20`
- **Authorization tab:** Bearer Token = `{{accessToken}}`

#### 1.5 Request Refund on a Payment
- **Method:** `POST`
- **URL:** `{{baseUrl}}/payments/{{seedPaymentId}}/refund`

  *(uses `seedPaymentId`, not `paymentId` — the seeded one is already `successful`; the one from 1.1 only becomes successful after 1.2 runs)*
- **Authorization tab:** Bearer Token = `{{accessToken}}`
- **Body tab:** `raw` / `JSON`:
  ```json
  { "reason": "Equipment was not as described" }
  ```

---

### Folder: 2. Deposits

#### 2.1 My Deposits
- **Method:** `GET`
- **URL:** `{{baseUrl}}/deposits/my?page=1&limit=20`
- **Authorization tab:** Bearer Token = `{{accessToken}}`
- **Tests tab:**
  ```javascript
  const json = pm.response.json();
  if (json.success && json.data.length > 0) {
      pm.environment.set('depositId', json.data[0].id);
  }
  ```

#### 2.2 Get Deposit by ID
- **Method:** `GET`
- **URL:** `{{baseUrl}}/deposits/{{seedDepositId}}`
- **Authorization tab:** Bearer Token = `{{accessToken}}`

#### 2.3 Hold Deposit (admin)
- **Method:** `PATCH`
- **URL:** `{{baseUrl}}/deposits/{{seedDepositId}}/hold`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`

#### 2.4 Release Deposit (owner)
- **Method:** `PATCH`
- **URL:** `{{baseUrl}}/deposits/{{seedDepositId}}/release`
- **Authorization tab:** Bearer Token = `{{ownerAccessToken}}`
- Requires the booking to be `completed` (the seeded one already is) and the deposit `held`. Succeeding here queues a `Refund` and moves the deposit out of `held` — re-run the seed script before testing 2.5.

#### 2.5 Refund Deposit (admin)
- **Method:** `PATCH`
- **URL:** `{{baseUrl}}/deposits/{{seedDepositId}}/refund`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- **Body tab:** `raw` / `JSON`:
  ```json
  { "reason": "Booking cancelled before completion" }
  ```
- Will `400` if you already ran 2.4 against the same `seedDepositId` — expected, not a bug.

---

### Folder: 3. Damage Claims

#### 3.1 Create Damage Claim
- **Method:** `POST`
- **URL:** `{{baseUrl}}/damage-claims`
- **Authorization tab:** Bearer Token = `{{ownerAccessToken}}` *(filed by the owner, not the renter)*
- **Body tab:** select `form-data`, add these rows:

  | Key | Value | Type |
  |---|---|---|
  | `bookingId` | `{{bookingIdCompleted}}` | Text |
  | `description` | `Hydraulic hose was torn and the bucket has a fresh dent that wasn't there at pickup.` | Text |
  | `amountClaimed` | `15000` | Text |
  | `photos` | *(choose a file, optional)* | File |

  To attach more than one photo, add additional `photos` rows (same key, File type).
- **Tests tab:**
  ```javascript
  const json = pm.response.json();
  if (json.success) {
      pm.environment.set('damageClaimId', json.data.id);
  }
  ```

#### 3.2 My Damage Claims
- **Method:** `GET`
- **URL:** `{{baseUrl}}/damage-claims/my?page=1&limit=20`
- **Authorization tab:** Bearer Token = `{{ownerAccessToken}}`

#### 3.3 Admin: List Damage Claims
- **Method:** `GET`
- **URL:** `{{baseUrl}}/admin/damage-claims?status=pending&page=1&limit=20`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- `status` is optional: `pending` | `approved` | `rejected`

#### 3.4 Admin: Approve Damage Claim
- **Method:** `PATCH`
- **URL:** `{{baseUrl}}/admin/damage-claims/{{damageClaimId}}/approve`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- Requires the linked deposit to still be `held` — if you already ran 2.4/2.5 against `seedDepositId`, re-seed first.

#### 3.5 Admin: Reject Damage Claim
- **Method:** `PATCH`
- **URL:** `{{baseUrl}}/admin/damage-claims/{{damageClaimId}}/reject`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- **Body tab:** `raw` / `JSON`:
  ```json
  { "reason": "Evidence photos are inconclusive" }
  ```
- Only one of 3.4/3.5 can succeed on the same claim (status must be `pending`). Run 3.1 again to file a second claim if you want to test the other one.

---

### Folder: 4. Admin Users

#### 4.1 Admin: List Users
- **Method:** `GET`
- **URL:** `{{baseUrl}}/admin/users?page=1&limit=20`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- Optional query params you can add in the **Params** tab: `status` (`active`/`suspended`/`deleted`), `search` (matches name or email)

#### 4.2 Admin: Get User by ID
- **Method:** `GET`
- **URL:** `{{baseUrl}}/admin/users/{{renterUserId}}`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`

#### 4.3 Admin: Update User Status
- **Method:** `PATCH`
- **URL:** `{{baseUrl}}/admin/users/{{renterUserId}}/status`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- **Body tab:** `raw` / `JSON`:
  ```json
  { "status": "suspended" }
  ```
  `status` must be one of `active` | `suspended` | `deleted`

#### 4.4 Admin: Verify User Identity
- **Method:** `PATCH`
- **URL:** `{{baseUrl}}/admin/users/{{renterUserId}}/verify`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- Returns `409` if already verified — that's expected on a second run.

#### 4.5 Admin: Delete User
- **Method:** `DELETE`
- **URL:** `{{baseUrl}}/admin/users/{{renterUserId}}`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- ⚠️ Soft-deletes your test renter (status → `deleted`). Recoverable by re-running 4.3 with `"status": "active"`. Consider testing this one last, or re-seeding afterward.

---

### Folder: 5. Analytics

All five are `GET`, admin-only, no body.

#### 5.1 Analytics: Dashboard
- **URL:** `{{baseUrl}}/admin/analytics/dashboard`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`

#### 5.2 Analytics: Revenue
- **URL:** `{{baseUrl}}/admin/analytics/revenue?from=2026-06-01&to=2026-08-01`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- `from`/`to` optional (ISO dates); defaults to the last 30 days if omitted

#### 5.3 Analytics: Bookings
- **URL:** `{{baseUrl}}/admin/analytics/bookings?from=2026-06-01&to=2026-08-01`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`

#### 5.4 Analytics: Users
- **URL:** `{{baseUrl}}/admin/analytics/users?from=2026-06-01&to=2026-08-01`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`

#### 5.5 Analytics: Equipment
- **URL:** `{{baseUrl}}/admin/analytics/equipment?limit=10`
- **Authorization tab:** Bearer Token = `{{adminAccessToken}}`
- `limit` optional, 1–50, default 10

---

## Part 4 — Suggested run order

1. Everything in **1. Payments**, top to bottom (1.2 needs 1.1's `lastPaymentReference`)
2. **2. Deposits** — run 2.1 first (it fills `depositId`, though most of 2.x actually use `seedDepositId` from the seed script directly)
3. **3. Damage Claims** — run 3.1 before 3.3/3.4/3.5 (they need `damageClaimId`)
4. **4. Admin Users** and **5. Analytics** have no dependency on anything above — safe to run any time, in any order

If something 400s/404s that you don't expect, the most common cause is a stale ID — re-run `npm run seed:test-data` to reset your test booking/payment/deposit to a clean state.
