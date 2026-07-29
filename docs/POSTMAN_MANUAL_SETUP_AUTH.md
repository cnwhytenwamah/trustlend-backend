# Manual Postman Setup — Authentication

Auth is fully built (it's the reference implementation the rest of the codebase follows), so every request below hits real logic — no seed script, no stubs. This slots in as "Part 0" before the five-module guide: once you have a real `accessToken` from Login, you can use it anywhere the other guide calls for `{{accessToken}}` instead of the seed script's signed token.

---

## Part 1 — Environment variables to add

| Variable | Initial value | Type |
|---|---|---|
| `testEmail` | `tester@trustlend.dev` | default |
| `testPassword` | `Password123!` | secret |
| `accessToken` | *(blank — filled by Login)* | secret |
| `refreshToken` | *(blank — filled by Login)* | secret |
| `emailVerifyToken` | *(blank — see the note in 1.6)* | default |
| `resetPasswordToken` | *(blank — see the note in 1.5)* | default |

If you already added `accessToken` from the previous guide (seed-script based), that's fine — Login below will just overwrite it with a real one.

---

## Part 2 — A note on email delivery

Two endpoints (`forgot-password`, and the verification flow) work by emailing a link containing a token — the API deliberately never returns the token directly, since that would defeat the point of emailing it. Two ways to actually get the token for testing:

**Option A (real email):** make sure `RESEND_API_KEY` is set in `.env` and you're using a real inbox for `testEmail`. Check the email, copy the `token` query param from the link.

**Option B (local shortcut):** temporarily add one line to `src/services/auth.service.ts` so the token prints to your server console — remove it before committing:
```typescript
// TEMPORARY — remove before committing
console.log('verifyUrl:', verifyUrl);   // inside register() and resendVerification()
console.log('resetUrl:', resetUrl);     // inside forgotPassword()
```
Either way, you're pasting the same `token` value into Postman — the requests below don't change.

---

## Part 3 — Building each request

### 1.1 Register
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/register`
- **Authorization tab:** No Auth
- **Body tab:** `raw` / `JSON`:
  ```json
  {
    "firstName": "Test",
    "lastName": "User",
    "email": "{{testEmail}}",
    "phone": "+2348012345678",
    "password": "{{Password}}"
  }
  ```
- Expect `201`. `phone` is optional — you can drop it. This queues a verification email (see Part 2) but does **not** block login below.
- If you re-run this with the same email, expect `409 An account with this email already exists` — that's correct behavior, not a bug.

### 1.2 Login
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/login`
- **Authorization tab:** No Auth
- **Body tab:** `raw` / `JSON`:
  ```json
  {
    "email": "{{testEmail}}",
    "password": "{{testPassword}}"
  }
  ```
- **Tests tab:**
  ```javascript
  const json = pm.response.json();
  if (json.success) {
      pm.environment.set('accessToken', json.data.accessToken);
      pm.environment.set('refreshToken', json.data.refreshToken);
  }
  ```
- Expect `200` with `accessToken`, `refreshToken`, and a `user` object. Run this any time your `accessToken` expires (default 15 min, see `JWT_ACCESS_EXPIRES_IN` in `.env`).

### 1.3 Refresh Token
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/refresh-token`
- **Authorization tab:** No Auth
- **Body tab:** `raw` / `JSON`:
  ```json
  { "refreshToken": "{{refreshToken}}" }
  ```
- **Tests tab:**
  ```javascript
  const json = pm.response.json();
  if (json.success) {
      pm.environment.set('accessToken', json.data.accessToken);
  }
  ```
- Use this instead of logging in again once your access token expires but the refresh token (7 days by default) is still valid.

### 1.4 Logout
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/logout`
- **Authorization tab:** No Auth *(the route doesn't require it — this is currently a stateless no-op; the client is expected to discard its tokens client-side. There's a comment in `auth.controller.ts` noting where server-side token revocation would go if that's added later.)*
- Expect `200` regardless of whether you send a token.

### 1.5 Forgot Password
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/forgot-password`
- **Authorization tab:** No Auth
- **Body tab:** `raw` / `JSON`:
  ```json
  { "email": "{{testEmail}}" }
  ```
- Always returns `200` with the same generic message, whether or not that email exists — this is intentional (doesn't leak which emails are registered). Grab the reset token per Part 2, then set `resetPasswordToken` in your environment.

### 1.6 Reset Password
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/reset-password`
- **Authorization tab:** No Auth
- **Body tab:** `raw` / `JSON`:
  ```json
  {
    "token": "{{resetPasswordToken}}",
    "newPassword": "NewPassword456!"
  }
  ```
- Token expires after 30 minutes. After this succeeds, update `testPassword` in your environment to match, or Login (1.2) will start failing.

### 1.7 Verify Email
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/verify-email`
- **Authorization tab:** No Auth
- **Body tab:** `raw` / `JSON`:
  ```json
  { "token": "{{emailVerifyToken}}" }
  ```
- Token comes from Register's (1.1) queued email, or Resend Verification (1.8) if you need a fresh one. Expires after 24 hours.

### 1.8 Resend Verification
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/resend-verification`
- **Authorization tab:** No Auth
- **Body tab:** `raw` / `JSON`:
  ```json
  { "email": "{{testEmail}}" }
  ```
- Same "always returns success" privacy behavior as Forgot Password. Silently does nothing if the email is already verified or doesn't exist.

---

## Part 4 — Suggested run order

1. **Register** once
2. **Login** — capture `accessToken`/`refreshToken`, use these everywhere else in your collection from now on instead of the seed script's tokens
3. **Refresh Token** whenever `accessToken` expires (15 min default) rather than logging in again
4. **Forgot Password → Reset Password** as one pair, whenever you want to test that flow
5. **Verify Email** / **Resend Verification** as their own pair
6. **Logout** — trivial, test any time

One nice side effect: once you have a real `accessToken` from Login, you can point the **Admin Users** and **Analytics** folders from the other guide at a real admin account too — just register a user, then manually flip their `role` to `admin` directly in Postgres (`UPDATE users SET role = 'admin' WHERE email = '...'`), and log in again to get a token carrying that role.
