import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, dob } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password,
      phone,
      dob
    });

    const token = newUser.generateToken();

    return res.status(201).json({
      token,
      user: newUser.toPublicJSON()
    });
  } catch (err) {
    console.error("=== REGISTER ERROR ===");
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await user.verifyPassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = user.generateToken();

    res.json({ 
      token,
      user : user.toPublicJSON()
    });

  } catch (err) {
    console.error("=== LOGIN ERROR ===");
    console.error(err);  // ⚠️ Log full error
    res.status(500).json({ message: err.message });
  }
};