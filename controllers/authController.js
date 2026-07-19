import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

// @route POST /api/auth/login
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    }

    return res.status(401).json({ message: "Invalid username or password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/logout
// Stateless JWT — logout is handled by the client discarding the token.
// This endpoint exists so the frontend has a clean call to hit.
export const logoutAdmin = async (req, res) => {
  return res.json({ message: "Logged out successfully" });
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  return res.json(req.admin);
};
