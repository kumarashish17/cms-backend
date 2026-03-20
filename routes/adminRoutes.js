import express from "express";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import User from "../models/User.js";

const router = express.Router();


// ================= GET PENDING USERS =================
router.get(
  "/pending-users",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find({ status: "pending" }).select("-password");

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ================= APPROVE USER =================
router.put(
  "/approve/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.status = "approved";
      await user.save();

      res.json({
        message: "User approved successfully",
        user,
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ================= REJECT USER =================
router.put(
  "/reject/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.status = "rejected";
      await user.save();

      res.json({
        message: "User rejected",
        user,
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ================= CREATE TEACHER =================
router.post(
  "/create-teacher",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const teacher = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "teacher",
        status: "approved", // direct login access
      });

      res.status(201).json({
        message: "Teacher created successfully",
        teacher,
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


export default router;