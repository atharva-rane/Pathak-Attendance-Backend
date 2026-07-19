import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

// @route GET /api/attendance?date=YYYY-MM-DD&vadan=Dhol
// Returns attendance records for the given date (optionally filtered by vadan)
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date, vadan } = req.query;
    if (!date) return res.status(400).json({ message: "date query param is required" });

    let studentIds;
    if (vadan) {
      const students = await Student.find({ vadan }).select("_id");
      studentIds = students.map((s) => s._id);
    }

    const filter = { date };
    if (studentIds) filter.student = { $in: studentIds };

    const records = await Attendance.find(filter);
    return res.json(records);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route POST /api/attendance
// body: { studentId, date, status }
// Upserts — marking again on the same date overwrites the previous status
export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: "studentId, date and status are required" });
    }

    const record = await Attendance.findOneAndUpdate(
      { student: studentId, date },
      { student: studentId, date, status },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json(record);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route GET /api/attendance/summary?date=YYYY-MM-DD
// Returns Dhol/Tasha present & absent counts for the given date
export const getSummary = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date query param is required" });

    const students = await Student.find().select("_id vadan");
    const records = await Attendance.find({ date });

    const statusByStudent = {};
    records.forEach((r) => {
      statusByStudent[r.student.toString()] = r.status;
    });

    const summary = {
      dholPresent: 0,
      dholAbsent: 0,
      tashaPresent: 0,
      tashaAbsent: 0,
      totalPresent: 0,
      totalAbsent: 0,
    };

    // "Absent" and "Seva" both count as not-present for the absent totals
    students.forEach((s) => {
      const status = statusByStudent[s._id.toString()];
      const isPresent = status === "Present";
      const isMarkedAbsent = status === "Absent" || status === "Seva";

      if (s.vadan === "Dhol") {
        if (isPresent) summary.dholPresent += 1;
        if (isMarkedAbsent) summary.dholAbsent += 1;
      } else if (s.vadan === "Tasha") {
        if (isPresent) summary.tashaPresent += 1;
        if (isMarkedAbsent) summary.tashaAbsent += 1;
      }
    });

    summary.totalPresent = summary.dholPresent + summary.tashaPresent;
    summary.totalAbsent = summary.dholAbsent + summary.tashaAbsent;

    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
