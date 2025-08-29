import User from "../models/user.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check for existing user
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered." });

    // 2. Hash password
    const hash = await bcrypt.hash(password, 12);


    // 4. Create user (unverified)
    const user = new User({
      username,
      email,
      password: hash,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

export default { register };