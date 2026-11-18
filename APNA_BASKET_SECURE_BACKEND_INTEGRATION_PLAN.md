# Apna Basket Secure Backend Integration Plan

Status: isolated integration branch; production `main` and Firebase are unchanged.

## Verified current app behavior

The current `Apna_Basket.html` on `main` (V13) still:
- Creates customer orders directly with Firestore `setDoc(orders/{id})`.
- Reads `settings/main` for every connected user.
- Writes all shop settings back to `settings/main`.
- Approves orders with a browser-side Firestore transaction that changes stock.
- Updates order status directly from the browser.
- Uses Firebase Web SDK 10.14.1 dynamic module imports; Functions SDK is not loaded.
- Uses anonymous customer sign-in and a fixed Owner UID check in the browser.

## Secure backend contract to integrate

Callable Functions in `Science-Centre-AI-Shopping-Hub`:
- `quoteCustomerOrder`: authenticated customer; accepts `items[{productId, quantity}]` and `pincode`.
- `createCustomerOrder`: authenticated customer; accepts `name, phone, address, payment, note, idempotencyKey, pincode, items`; server-calculates totals.
- `approveOrder`: Owner UID only; checks current product active/stock and immutable order price snapshots before stock decrement.
- `rejectOrder`: Owner UID only.
- `setOrderStatus`: Owner UID only; enforces legal status transitions.
- `verifyOwnerAccess`: Owner UID only.

Functions region: `asia-south1`. Firebase project: `apna-basket-3433e`.

## Blocking compatibility gaps

1. The current customer order includes browser-calculated subtotal, delivery, discount and total. The callable must ignore client totals and recalculate them.
2. Current coupon discounts are not implemented in the callable quote. Coupon checkout must remain disabled or be migrated to server-side coupon validation before enabling callable checkout.
3. Callable quote currently requires `privateSettings/main` fields: `serviceablePincodes`, `deliveryFeePaise`, `minimumOrderPaise`.
4. Current app uses one `settings/main` document for public shop presentation and sensitive/admin configuration. It must be split into `publicSettings/main` and `privateSettings/main`; never expose private settings to customers.
5. Product catalog upload must not overwrite trusted stock or server price fields from arbitrary browser state.
6. Customer order ID and idempotency key need stable generation and retry handling; avoid duplicate orders if the network response is lost.
7. Customer order read access must remain scoped to the authenticated customer's own UID; Admin order listing remains Owner-only.
8. Replace browser-side approval, rejection and status writes with callable Functions only.
9. Payment remains unverified. UPI orders must not be marked Paid until a trusted payment webhook/verification integration exists.

## Safe implementation sequence

- [x] Load Firebase Functions SDK and callable wrappers in the app (commit `8829060`).
- [x] Add a compatibility layer for quote/create/approve/reject/status calls (commit `8829060`).
- [x] Change customer order creation to callable `createCustomerOrder`; checkout uses server quote totals (commit `c02a6c3`).
- [x] Split app sync into `publicSettings/main` (customer-safe presentation fields) and `privateSettings/main` (server quote configuration); legacy `settings/main` is no longer read or written by the migrated client (commit `54b9a6f`). One-time migration/population and emulator verification remain before production.
- [ ] Replace all browser stock/status mutations with callable functions.
- [x] Preserve a clearly labelled WhatsApp-only fallback when cloud checkout is unavailable; do not claim cloud order saved (commit `c02a6c3`).
- [ ] Add Emulator/preview tests for customer, Owner, stock, price-change, coupon and retry scenarios.
- [ ] Review security rules against the migrated app and only then plan deployment.

## Deployment guardrails

Do not deploy the new Firestore Rules or Functions against production until the app migration is complete and tested. Existing V13 is incompatible with the new rules and would lose customer settings/order/admin workflows if the rules were applied now.


## Compatibility audit — 19 Nov 2026
- Confirmed app listeners now read `publicSettings/main`; customer product listener queries only active products; Owner order listener is owner-only.
- Confirmed client no longer references legacy `settings/main`.
- Removed obsolete `firebaseCreateOrder` helper that wrote orders directly from the browser; customer checkout must use `createCustomerOrder` callable (commit `0a01481`).
- Remaining blocker: product sync uses full-document writes. Firestore Rules intentionally reject changes to `products/{id}.stock`; therefore catalog sync can fail when local stock differs from cloud stock. Stock changes need a trusted Owner callable or a dedicated controlled migration path.
- Emulator rules suite currently has 18 tests, but it does not run the actual HTML app in a browser. A separate frontend integration/preview test is still required.
- Do not deploy production rules until stock management, public/private settings seed, and end-to-end checkout are tested.


## Secure stock update — 19 Nov 2026
- Backend branch adds Owner-only callable `setProductStock`; validates integer stock range 0–1,000,000, updates the product transactionally, and writes an audit record (`e08928d`).
- Frontend branch adds `setProductStockSecure`. Existing product catalog updates now omit the stock field from direct Firestore writes; changed stock is sent separately through the callable. New product creation retains initial stock.
- Frontend commit: `1a787887`.
- Still pending: run backend CI, add callable unit/integration tests, validate Firestore Rules compatibility in Emulator, and test the actual app end-to-end. Production deployment remains blocked.


## Stock callable test coverage — 19 Nov 2026
- Added emulator integration test for `setProductStock`: rejects non-Owner callers, negative/fractional/over-limit values; verifies successful update and `orderAudit` entry.
- Backend test commit: `f1e0f9b`.
- Workflow-run lookup for this commit returned no PR-triggered runs; this is not evidence of a pass or failure. Build and emulator execution are still unverified here.


## Idempotency security audit — 19 Nov 2026
- Backend now hashes the normalized customer intent (UID, contact/address, payment, note, PIN, product IDs and quantities) with SHA-256 and stores the fingerprint beside the idempotency key.
- Reusing a key for a different order payload is rejected with `already-exists`; exact retries return the original order.
- Fingerprint is independent of mutable catalog price/availability. Existing identical retries are checked before quote generation, so a product price or active-state change does not prevent retrieval of an already-created order.
- Added emulator integration tests for payload mismatch and stable retry after product changes.
- Backend commits: `92e9ff3`, `6c7fa89`, `ce34b22`, `61cbd35`, `4c0826c`, `4acbf7a`.
- Tests/build/CI have not been executed in this environment; deployment remains blocked pending actual CI and emulator verification.


## Payment state safety — 19 Nov 2026
- New orders now persist explicit server-set payment fields: UPI `paymentStatus: "Unverified"`; Cash on Delivery `paymentStatus: "PendingCollection"`; both set `paymentVerified: false`.
- No client or admin callable has been added to mark UPI paid. Firestore Rules continue to deny all client order updates and payment writes.
- Added emulator integration assertions for COD pending collection and UPI unverified states.
- Backend commits: `23abce1`, `dbdb5bd`.
- A trusted payment provider/webhook is not configured in the project context. Therefore automatic payment verification is intentionally not implemented; manual screenshots/UTR must not be treated as authoritative settlement.
- CI/emulator execution remains unverified; do not deploy.


## Order approval integrity hardening — 19 Nov 2026
- Owner approval now refuses UPI orders unless trusted verification fields explicitly indicate `paymentVerified: true` and `paymentStatus: "Verified"`. No verification endpoint exists yet, so UPI orders remain Pending; COD approval remains available.
- Approval now checks the item list has no duplicate/inconsistent product IDs, verifies item quantities and price snapshots, recomputes subtotal, and validates delivery fee, zero discount, and total arithmetic before decrementing stock.
- Added emulator integration tests for blocked unverified UPI approval and tampered aggregate totals; both assert stock remains unchanged and order remains Pending.
- Backend commits: `357a901` (approval validation), `238d380` (integration tests).
- These tests have been added but not executed/CI-verified in this environment. Production Rules/Functions deployment and PR merge remain blocked.


## Payment-state approval audit — 19 Nov 2026
- Approval now validates the payment method against the two supported values only: `UPI` and `Cash on Delivery`.
- COD approval requires the server-created state `paymentStatus: "PendingCollection"` and `paymentVerified: false`; malformed or legacy inconsistent COD states are rejected.
- UPI remains blocked unless the order carries trusted verified state; unsupported/unknown payment methods are rejected.
- Added emulator tests for unknown payment methods and inconsistent COD payment state; both assert stock is unchanged.
- Backend commits: `b87b1b5` (validation), `8f03e71` (tests).
- Tests/CI have not yet been executed or verified; no production deployment or PR merge.


## CI verification — 19 Nov 2026
- GitHub Actions Run #109 completed with overall conclusion `success` on backend branch head `8f03e71db154eebc104847b1a31fc01b83c33ced`.
- `firestore-rules` job: success; Firestore Emulator tests completed successfully.
- `functions-build` job: success; Functions dependencies install, TypeScript compilation, security unit tests, and callable integration tests all completed successfully.
- This verifies the backend branch through commit `8f03e71`, including the payment-state approval guards and their integration tests.
- It does not verify later commits if any, frontend browser/end-to-end compatibility, production Firebase configuration, payment-provider webhook, or production deployment.
- Keep PR #1 Draft and do not merge/deploy until the remaining frontend and production readiness checks are completed.
