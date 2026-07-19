// One-time script to create the admin login used by the frontend.
// Run with: npm run seed:admin
// Edit the username/password below before running, then delete/change
// the password afterwards if you like — you can also add a "change
// password" route later if needed.

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import mongoose from "mongoose";

dotenv.config();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Aniruddha1956";

const run = async () => {
  await connectDB();

  const existing = await Admin.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log(`Admin "${ADMIN_USERNAME}" already exists. Nothing to do.`);
  } else {
    await Admin.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    console.log(
      `Admin created — username: ${ADMIN_USERNAME}, password: ${ADMIN_PASSWORD}`,
    );
    console.log("Please log in and remember to keep this password safe.");
  }

  await mongoose.connection.close();
  process.exit(0);
};

run();
