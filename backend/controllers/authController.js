const User = require("../models/user");
const Article = require('../models/article');
const Comment = require('../models/comments');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { isPasswordStrong } = require("../helpers/isPasswordStrong");
const createBlockedToken = require("../service/blockedToken");

/** Auth Controller */

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, rePassword } = req.body;

    // Check if all fields are filled
    if (!name || !email || !password || !rePassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please write a valid email" });
    }

    // Check if email exists
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if passwords match
    if (password !== rePassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // If password is not strong
    const passwordCheck = isPasswordStrong(password);
    if (passwordCheck.isValid == false) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are filled
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please write a valid email" });
    }

    // Check if email exists
    const exists = await User.findOne({ where: { email } });
    if (!exists) {
      return res.status(400).json({ message: "Email does not exists" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, exists.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Create token
    const token = jwt.sign(
      {
        id: exists.id,
        name: exists.name,
        email: exists.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Successfully logged in",
      token,
      user: { id: exists.id, name: exists.name, email: exists.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user articles
    const articles = await Article.findAll({ where: { createdBy: user.id } });

    // Return user comments
    const comments = await Comment.findAll({ where: { createdBy: user.id }, include: [{ model: Article, attributes: [ 'title' ]}]});

    res.status(200).json({user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin, isBlocked: user.isBlocked }}, articles, comments);

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, rePassword } = req.body;

  // Check if all fields are filled
  if (!oldPassword || !newPassword || !rePassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if passwords match
  if (newPassword !== rePassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // If password is not strong
  const passwordCheck = isPasswordStrong(newPassword);
  if (passwordCheck.isValid == false) {
    return res.status(400).json({ message: passwordCheck.message });
  }

  // Check if old password is correct
  const user = await User.findByPk(req.user.id);

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await user.update({ password: hashedPassword });

  res.status(200).json({ message: "Password changed successfully" });
};

// Change Name
exports.changeName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Name should be between 3 and 20 characters
    if (name.length > 20 || name.length < 3) {
      return res.status(400).json({ message: "Name should be between 3 and 20 characters" });
    }

    // Update name
    await User.update({ name }, { where: { id: req.user.id } });

    res.status(200).json({ message: "Name changed successfully", user: { id: req.user.id, name } });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};


// Logout
exports.logout = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.headers.authorization || req.headers.authorization === "") {
      return res
        .status(400)
        .json({
          message: "You are not logged in",
          error: "Please provide token in header",
        });
    }

    // delete req.headers.authorization;

    const token = req.headers.authorization.split(" ")[1];

    await createBlockedToken(token, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required"});
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found"});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect"});
    }

    const token = req.headers.authorization.split(" ")[1];

    await createBlockedToken(token, 2 * 60 * 60 * 1000);

    await user.destroy();

    res.status(200).json({ message: "Account deleted successfully"});

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}