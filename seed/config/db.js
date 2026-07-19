import mongoose from "mongoose";

// Cache the connection promise across invocations. On Vercel, the module can
// stay warm between requests, so we reuse the same connection instead of
// reconnecting (or racing a half-finished connection) on every request.
let connectionPromise = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) {
    // already connected
    return Promise.resolve(mongoose.connection);
  }

  if (!connectionPromise) {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
      })
      .then((conn) => {
        console.log("MongoDB connected:", conn.connection.host);
        return conn.connection;
      })
      .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        connectionPromise = null; // allow retry on next request
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;
