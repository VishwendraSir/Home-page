# Apna Basket V14 — Audit Notes

Date: 2026-11-18
Base: `main` / Apna Basket V13
Audit branch: `apna-basket-v14-audit-fixes`

## Fixes applied
1. Fixed a JavaScript parse blocker in `Apna_Basket.html`: `async async function firebaseCreateOrder` is now `async function firebaseCreateOrder`.
2. Fixed cloud coupon approval to use the same live coupon settings saved by the app in `settings/main` (`couponCode` and `couponPercent`). The previous code required a separate `coupons/{code}` document that the V13 UI never created, so coupon orders could fail during admin approval.
3. Updated the approval confirmation message to describe stock and total verification accurately.

## Static checks performed
- Confirmed the duplicate `async` syntax token is absent.
- Checked inline event-handler function references against declared functions: no unresolved handler calls found.
- Checked `getElementById()` references against HTML IDs: no missing IDs found.
- Confirmed the HTML source contains the expected script boundary (the second script token is in the receipt-print template).

## Findings requiring live environment validation
1. Firebase Auth, Firestore reads/writes, rules deployment, and real order round-trip cannot be certified from source inspection alone. Test with the actual Firebase project and two separate browser sessions.
2. The app's Admin PIN is stored in browser localStorage and only gates the UI. It is not a security boundary. Only Firebase owner-UID authorization should be treated as cloud authority; do not use local/demo Admin mode for production administration.
3. The local-only order list, profile, cart, and product edits live in localStorage and do not synchronize across devices unless Firebase is connected and the relevant admin/customer flows are used.
4. The WhatsApp destination number must be configured in Shop Settings; it is not a deploy-time default.
5. The app does not provide server-trusted payment settlement. UPI status must be confirmed by the shop separately.
6. The active Firestore rules must be verified in Firebase Console. The `shop/firestore.rules` file in this repository belongs to the separate affiliate shop flow, not Apna Basket. The matching Apna Basket rules are currently kept in the `Science-Centre-AI-Shopping-Hub` repository as `Apna_Basket_V12_Firestore_Rules.rules`; confirm that those rules are the deployed rules before production use.

## Manual acceptance tests still required
- Open the hosted app on Android Chrome and desktop; verify no console parse/runtime errors.
- Add product, change quantity, remove item, refresh, and confirm cart persistence.
- Check delivery fee, minimum order, valid/invalid coupon, and PIN-code restrictions.
- Submit a WhatsApp order and confirm the exact order text reaches the configured shop number.
- Sign in as the owner UID; upload products/settings; verify customer sees only active products.
- Place an authenticated test order; verify Firestore schema/rules accept it and admin sees it.
- Approve and reject test orders; verify stock decrements once only on approval and never on rejection.
- Test order tracking from the customer session and confirm another customer cannot read the order.
- Verify unauthorized users cannot write products, settings, or order status.

## Release status
This is a source-level fix branch. It is not yet merged to `main` and has not been promoted to the live GitHub Pages site. Do not mark the app production-ready until the manual Firebase and WhatsApp acceptance tests pass.
