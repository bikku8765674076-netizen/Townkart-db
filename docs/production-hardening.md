# TownKart production-hardening slice

This branch improves the existing Next.js + Prisma/PostgreSQL application in place.

## Changes in this slice

- Removes the hard-coded JWT signing-secret fallback. Every environment must provide a unique `JWT_SECRET` with at least 32 characters.
- Validates checkout line items and quantities on the server, aggregates duplicate cart lines, checks product and variant availability, and uses conditional stock decrements inside a database transaction to reduce overselling under concurrent checkout.
- Validates address ownership and required Indian address fields before placing an order.
- Keeps delivery OTPs out of the checkout-success URL and loads the OTP through the authenticated customer's order endpoint.
- Adds a delivery-partner API workflow for pickup, out-for-delivery and OTP-verified delivery completion. Delivery GET responses do not expose the OTP.
- Keeps COD payment status pending until the assigned rider verifies the customer's OTP at handoff.
- Enforces sequential admin order transitions, requires an approved online rider for assignment, and restores inventory when an eligible order is cancelled.
- Replaces the delivery dashboard and task screen's fake order details with API-backed assignments and status updates.
- Connects the admin order board to actual available riders and removes admin-side delivery completion without OTP verification.

## Required environment configuration

Set these variables in local `.env` and the deployment environment before deploying this branch:

- `DATABASE_URL`: connection string for the PostgreSQL database used by Prisma.
- `JWT_SECRET`: a unique, randomly generated secret of at least 32 characters. Do not reuse the example value and do not commit the real secret.

Example secret generation:

```bash
openssl rand -base64 32
```

Do not change the production secret casually: existing sessions signed with the previous secret will be invalidated. If the production deployment currently relies on the old hard-coded fallback, configure a new secret during a planned rollout and expect users to sign in again.

## Validation checklist before merging

1. Install dependencies with `npm ci`.
2. Run `npx prisma validate`.
3. Run `npx prisma generate`.
4. Run `npm run lint`.
5. Run `npm run build` against a staging database.
6. Test customer registration/login, checkout with normal and duplicate cart lines, concurrent checkout for the last unit, variant stock, address ownership, coupon usage limits, cancellation/restocking, rider assignment, and OTP success/failure.
7. Verify the deployed environment has `DATABASE_URL` and `JWT_SECRET` set before promoting the change.

## Still needed for a true production launch

This branch is a focused reliability slice, not a claim of complete parity with Blinkit. Before taking real customer orders, add automated integration tests and rate limiting for authentication/OTP endpoints, review service-area enforcement and delivery-zone configuration, verify the full admin role matrix, and run end-to-end tests against staging. Online payment integration and live GPS tracking are not added here; COD remains the supported checkout method.
