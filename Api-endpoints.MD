# RentIt (name TBD) — MVP API Endpoints

> Source of truth: copied from `Equipment_Rental_Marketplace_MVP_API_Endpoints.docx`.
> All routes are prefixed with `/api/v1` (see `src/routes/index.ts`).
> This list does not cover anything outside the core MVP scope.

## Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh-token`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`

## User Profile
- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/profile-photo`
- `DELETE /users/me`
- `GET /users/:id`

## Identity Verification
- `POST /verifications`
- `GET /verifications/me`
- `PATCH /verifications/me`
- `GET /admin/verifications`
- `PATCH /admin/verifications/:id/approve`
- `PATCH /admin/verifications/:id/reject`

## Equipment
- `POST /equipment`
- `GET /equipment`
- `GET /equipment/my`
- `GET /equipment/:id`
- `PATCH /equipment/:id`
- `DELETE /equipment/:id`

## Equipment Photos
- `POST /equipment/:id/photos`
- `DELETE /equipment/:id/photos/:photoId`
- `PATCH /equipment/:id/photos/:photoId/primary`

## Availability
- `GET /equipment/:id/availability`
- `PATCH /equipment/:id/availability`
- `POST /equipment/:id/block-dates`
- `DELETE /equipment/:id/block-dates/:blockId`

## Bookings
- `POST /bookings`
- `GET /bookings/my`
- `GET /bookings/:id`
- `PATCH /bookings/:id/cancel`
- `GET /owner/bookings`
- `PATCH /bookings/:id/accept`
- `PATCH /bookings/:id/decline`
- `PATCH /bookings/:id/start`
- `PATCH /bookings/:id/complete`

## Payments
- `POST /payments/initialize`
- `POST /payments/webhook`
- `GET /payments/:id`
- `GET /payments/my`
- `POST /payments/:id/refund`

## Deposits
- `GET /deposits/my`
- `GET /deposits/:id`
- `PATCH /deposits/:id/refund`
- `PATCH /deposits/:id/hold`
- `PATCH /deposits/:id/release`

## Reviews
- `POST /reviews`
- `GET /reviews/equipment/:equipmentId`
- `GET /reviews/user/:userId`
- `PATCH /reviews/:id`
- `DELETE /reviews/:id`

## Equipment Issues
- `POST /issues`
- `GET /issues/my`
- `GET /issues/:id`
- `PATCH /issues/:id`

## Owner Earnings
- `GET /earnings`
- `GET /earnings/summary`
- `GET /earnings/transactions`

## Admin Users
- `GET /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id/status`
- `PATCH /admin/users/:id/verify`
- `DELETE /admin/users/:id`

## Equipment Moderation
- `GET /admin/equipment`
- `PATCH /admin/equipment/:id/approve`
- `PATCH /admin/equipment/:id/reject`
- `DELETE /admin/equipment/:id`

## Disputes
- `POST /disputes`
- `GET /disputes/my`
- `GET /admin/disputes`
- `GET /admin/disputes/:id`
- `PATCH /admin/disputes/:id/resolve`
- `PATCH /admin/disputes/:id/close`

## Damage Claims
- `POST /damage-claims`
- `GET /damage-claims/my`
- `GET /admin/damage-claims`
- `PATCH /admin/damage-claims/:id/approve`
- `PATCH /admin/damage-claims/:id/reject`

## Refunds
- `GET /admin/refunds`
- `PATCH /admin/refunds/:id/process`
- `PATCH /admin/refunds/:id/reject`

## Transactions
- `GET /transactions/my`
- `GET /admin/transactions`
- `GET /admin/transactions/:id`

## Analytics
- `GET /admin/analytics/dashboard`
- `GET /admin/analytics/revenue`
- `GET /admin/analytics/bookings`
- `GET /admin/analytics/users`
- `GET /admin/analytics/equipment`

## Notifications
- `GET /notifications`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`