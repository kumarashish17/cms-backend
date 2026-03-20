import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🔓 Any logged-in user
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user,
  });
});

// 🔒 Only admin
router.get(
  "/admin",
  verifyToken,
  allowRoles("admin"),
  (req, res) => {
    res.json({
      message: "Admin access granted",
    });
  }
);

// 🔒 Only teacher
router.get(
  "/teacher",
  verifyToken,
  allowRoles("teacher"),
  (req, res) => {
    res.json({
      message: "Teacher access granted",
    });
  }
);

export default router;