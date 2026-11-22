const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
initializeApp();
const db = getFirestore();
const ADMIN_UID = "REPLACE_WITH_ADMIN_UID";
function requireAdmin(request) {
  if (!request.auth || request.auth.uid !== ADMIN_UID)
    throw new HttpsError("permission-denied", "Admin access required.");
}
exports.registerStudent = onCall(async request => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Google sign-in required.");
  if (!request.auth.token.email_verified)
    throw new HttpsError("permission-denied", "Verified email required.");
  const uid = request.auth.uid, ref = db.doc(`students/${uid}`);
  const snap = await ref.get();
  if (!snap.exists) await ref.create({
    uid, email: request.auth.token.email || "", name: request.auth.token.name || "",
    status: "pending", remaining: 0, batchNumber: 0,
    createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
  });
  return {status: (await ref.get()).get("status")};
});
exports.reviewStudent = onCall(async request => {
  requireAdmin(request);
  const {uid, action} = request.data || {};
  if (!uid || !["approve", "reject", "revoke", "grant50"].includes(action))
    throw new HttpsError("invalid-argument", "Invalid student or action.");
  const ref = db.doc(`students/${uid}`);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Student not found.");
    const d = snap.data();
    if (action === "approve" || action === "grant50") tx.update(ref, {
      status: "approved", remaining: action === "approve" ? 50 : Number(d.remaining || 0) + 50,
      batchNumber: Number(d.batchNumber || 0) + 1, updatedAt: FieldValue.serverTimestamp()
    });
    else tx.update(ref, {status: action === "reject" ? "rejected" : "revoked", remaining: 0,
      updatedAt: FieldValue.serverTimestamp()});
  });
  return {ok: true};
});
exports.consumeQuestion = onCall(async request => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");
  const {questionId} = request.data || {};
  if (typeof questionId !== "string" || !questionId || questionId.length > 120)
    throw new HttpsError("invalid-argument", "Valid questionId required.");
  const uid = request.auth.uid, studentRef = db.doc(`students/${uid}`);
  const attemptRef = db.collection("attempts").doc();
  return db.runTransaction(async tx => {
    const snap = await tx.get(studentRef);
    if (!snap.exists || snap.get("status") !== "approved")
      throw new HttpsError("permission-denied", "Admin approval required.");
    const remaining = Number(snap.get("remaining") || 0);
    if (remaining <= 0) throw new HttpsError("resource-exhausted", "Batch complete. Request next 50.");
    tx.update(studentRef, {remaining: remaining - 1, updatedAt: FieldValue.serverTimestamp()});
    tx.create(attemptRef, {uid, questionId, batchNumber: snap.get("batchNumber") || 1,
      createdAt: FieldValue.serverTimestamp()});
    return {remaining: remaining - 1};
  });
});
