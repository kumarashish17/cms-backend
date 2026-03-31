import express from "express";
import { createCourse } from "../controllers/courseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { assignTeacher } from "../controllers/courseController.js";
import { getCourses } from "../controllers/courseController.js";
import { enrollCourse } from "../controllers/courseController.js";
import { getMyCourses } from "../controllers/courseController.js";
const router = express.Router();

// Only admin can create course
router.post(
  "/create",
  verifyToken,
  allowRoles("admin"),
  createCourse
);
router.put(
  "/assign-teacher",
  verifyToken,
  allowRoles("admin"),
  assignTeacher
);
router.get(
  "/all",
  verifyToken,
  getCourses
);
router.post(
  "/enroll/:id",
  verifyToken,
  allowRoles("student"),
  enrollCourse
);
router.get(
  "/my-courses",
  verifyToken,
  allowRoles("student"),
  getMyCourses
);
export default router;