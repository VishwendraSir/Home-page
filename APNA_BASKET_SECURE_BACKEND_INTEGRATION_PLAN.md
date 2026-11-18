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
- [ ] Split public and private settings, including a safe one-time migration procedure.
- [ ] Replace all browser stock/status mutations with callable functions.
- [x] Preserve a clearly labelled WhatsApp-only fallback when cloud checkout is unavailable; do not claim cloud order saved (commit `c02a6c3`).
- [ ] Add Emulator/preview tests for customer, Owner, stock, price-change, coupon and retry scenarios.
- [ ] Review security rules against the migrated app and only then plan deployment.

## Deployment guardrails

Do not deploy the new Firestore Rules or Functions against production until the app migration is complete and tested. Existing V13 is incompatible with the new rules and would lose customer settings/order/admin workflows if the rules were applied now.
