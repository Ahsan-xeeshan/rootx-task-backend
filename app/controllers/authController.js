const bcrypt = require("bcryptjs");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateRegisterInput = ({ username, email, password }) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  if (!username) return "Name is required";
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Email is invalid";
  if (!password) return "Password is required";
  if (!passwordRegex.test(password))
    return "Password must be 8-15 characters with uppercase, lowercase, digit, and special character";

  return null; // no errors
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const error = validateRegisterInput({ username, email, password });
    if (error) return res.status(400).json({ error });

    const emailNormalized = email.toLowerCase();
    const existingEmail = await Users.findOne({ email: emailNormalized });
    if (existingEmail) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new Users({
      username,
      email: emailNormalized,
      password: hash,
    });

    await user.save();

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await Users.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = bcrypt.compareSync(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(403).json({ message: "Password does not match" });
    }

    // Generate Access Token (short-lived)
    const accessToken = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_KEY,
      { expiresIn: "15m" } // 15 minutes
    );

    // Generate Refresh Token (longer-lived)
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" } // 7 days
    );

    const { password: pass, ...userData } = existingUser._doc;

    res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: "Sign in successful",
        token: accessToken,
        refreshToken,
        user: userData,
      });
  } catch (error) {
    console.error("Error in signInController:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const logoutUser = async (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  signInUser,
  logoutUser,
};
