import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, "")); // trim whitespace + trailing slash

app.use(
  cors({
    origin: (origin, callback) => {
      // requests with no origin (curl, server-to-server, same-origin) are allowed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(
          `CORS blocked request from origin "${origin}". Allowed origins: ${allowedOrigins.join(", ")}`,
        );
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pathak Attendance API is running");
});

// Make sure the DB connection is ready before any route touches the DB.
// This avoids the classic serverless race where a request arrives on a
// cold start before mongoose has finished connecting.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res
      .status(503)
      .json({ message: "Database unavailable. Please try again shortly." });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

// Locally (not on Vercel) connect once up front and start listening.
// On Vercel, the per-request middleware above handles connecting.
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
}

export default app;
