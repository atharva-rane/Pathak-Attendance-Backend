import express from "express";
import {
  getAttendanceByDate,
  markAttendance,
  getSummary,
  getPracticedDates,
  getOverallAttendance,
  deleteAttendanceByDate,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAttendanceByDate);
router.get("/summary", getSummary);
router.get("/dates", getPracticedDates);
router.get("/overall", getOverallAttendance);
router.post("/", markAttendance);
router.delete("/date/:date", deleteAttendanceByDate);

export default router;
