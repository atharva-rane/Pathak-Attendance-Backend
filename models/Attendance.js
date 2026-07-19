import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    // Stored as YYYY-MM-DD so one record exists per student per day
    date: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "Seva"],
    },
  },
  { timestamps: true }
);

// A student can only have one attendance record per date
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
