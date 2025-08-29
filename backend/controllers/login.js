import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/jwt.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // 3. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // 4. Create JWT payload
    const payload = {
      userId: user._id,
      email: user.email,
      username: user.username,
    };

    // 5. Sign and return JWT
    const token = signJwt(payload);

    res.json({
      token,
      user: {
        email: user.email,
        username: user.username,
        userId: user._id,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default { login };