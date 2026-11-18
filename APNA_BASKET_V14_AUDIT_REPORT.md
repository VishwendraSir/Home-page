# Apna Basket V14 — Audit Notes

Date: 2026-11-18
Base: `main` / Apna Basket V13
Audit branch: `apna-basket-v14-audit-fixes`

## Fixes applied
1. Fixed a JavaScript parse blocker in `Apna_Basket.html`: `async async function firebaseCreateOrder` is now `async function firebaseCreateOrder`.
2. Fixed cloud coupon approval to use the same live coupon settings saved by the app in `settings/main` (`couponCode` and `couponPercent`). The previous code required a separate `coupons/{code}` document that the V13 UI never created, so coupon orders could fail during admin approval.
3. Updated the approval confirmation message to describe stock and total verification accurately.
4. Removed a redundant Firestore `users/{uid}.role == admin` check from client-side Admin login. The Firestore Rules identify the owner by the fixed Admin UID, so client verification now matches the actual authorization boundary.
5. Fixed status normalization so `Rejected` remains `Rejected` in the Admin and Delivery UI instead of being incorrectly displayed as `Cancelled`.
6. Fixed a false-positive upload message: the Admin upload flow now reports success only when the Cloud products/settings save actually succeeds.

## Static checks performed
- Confirmed the duplicate `async` syntax token is absent.
- Confirmed Admin verification uses the owner UID and no longer requires a redundant role document.
- Confirmed `Rejected` status is no longer remapped to `Cancelled`.
- Confirmed the catalog upload flow checks the save result before displaying success.
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


## Acceptance test progress (2026-11-18)
The project owner reported that the following five tests passed on their test setup:
- Admin Firebase Login
- Products + Settings Cloud Upload
- Customer creates a new order
- Admin approves the order and stock is deducted
- Customer order tracking

These are recorded as user-reported results; they have not been independently reproduced from this repository connection.

## Remaining manual acceptance tests
1. Cart persistence after refresh and quantity/remove edge cases.
2. Delivery fee, minimum order, valid/invalid coupon, and allowed/disallowed PIN code.
3. Confirm the exact WhatsApp message reaches the configured shop number.
4. Verify rejected orders do not decrement stock and cannot be approved twice.
5. Verify status transitions and delivery actions sync to the customer session.
6. Attempt customer writes to products/settings and another customer's order reads; all must be denied by deployed Firestore Rules.
7. Verify the exact rules in this repository are the ones deployed in Firebase Console.
8. Test Android Chrome and desktop browser; inspect console for syntax/runtime errors.

## Additional static code check
- Normalized all accidental duplicate `async async function` declarations introduced during the follow-up edits. The current branch contains zero matches.
- Firebase/Firestore live security and transaction behavior still requires the above manual tests against the actual Firebase project.
