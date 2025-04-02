const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/passwordHash");
const Customer = require("../models/Customer");
const Restaurant = require("../models/Restaurant");

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body; // Role: "customer" or "restaurant"

  try {
    const hashedPassword = await hashPassword(password);
    let user;

    if (role === "restaurant") {
      user = await Restaurant.create({ name, email, password: hashedPassword });
    } else {
      user = await Customer.create({ name, email, password: hashedPassword });
    }

    res.status(201).json({ message: `${role} signed up successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing up" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Customer.findOne({ email });
    let role = "customer";
    console.log(user);
    if (!user) {
      user = await Restaurant.findOne({ email });
      role = "restaurant";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    req.session.user = { id: user._id, name: user.name, email: user.email, role };  // Store user details in session
    console.log(req.session.user);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log(token);
    res.json({ message: "Login successful", token, role, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logout successful" });
  });
};
