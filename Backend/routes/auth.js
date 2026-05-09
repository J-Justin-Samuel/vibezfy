import { Router } from "express";
import { requireAuth } from "../middleware/firebaseAuth.js";

const router = Router();

/**
 * GET /api/auth/me
 * Returns the verified Firebase user info.
 * Frontend can call this to confirm their token is valid.
 */
router.get("/me", requireAuth, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
  });
});

export default router;
