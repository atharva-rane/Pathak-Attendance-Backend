import express from "express";
import {
  getAttendanceByDate,
  markAttendance,
  getSummary,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAttendanceByDate);
router.get("/summary", getSummary);
router.post("/", markAttendance);

export default router;
