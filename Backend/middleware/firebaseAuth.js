import admin from "firebase-admin";
import { createRequire } from "module";
import { readFileSync, existsSync } from "fs";

// Initialize Firebase Admin once
if (!admin.apps.length) {
  const saPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    "./firebase-service-account.json";
  if (existsSync(saPath)) {
    const serviceAccount = JSON.parse(readFileSync(saPath, "utf8"));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    console.warn(
      "⚠️  Firebase service account not found — auth middleware disabled",
    );
  }
}

/**
 * Middleware: verify Firebase ID token from Authorization header
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing auth token" });
  }
  const token = header.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default admin;
