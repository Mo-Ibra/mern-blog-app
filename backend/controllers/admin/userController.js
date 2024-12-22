const bcrypt = require('bcrypt');
const { isPasswordStrong } = require('../../helpers/isPasswordStrong');

/** CRUD User Controller */

const User = require('../../models/user');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Get use by id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

// Create a new user
exports.createNewUser = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, rePassword } = req.body;

    // Check if all fields are filled
    if (!name || !email || !password || !rePassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please write a valid email' });
    }

    // Check if email exists
    const emailExists = await User.findOne({ where: { email}});
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if passwords match
    if (password !== rePassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // If password is not strong
    const passwordCheck = isPasswordStrong(password);
    if (passwordCheck.isValid == false) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json(user); // Created
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // update from url
    const { name, email } = req.body;
    const user = await User.update({ name, email }, { where: { id}});
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Block User
exports.blockUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "Admin cannot be blocked" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    user.isBlocked = true;
    await user.save();

    res.json({ message: "User blocked successfully", user });

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

// Unblock User
exports.unblockUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "Admin cannot be unblocked" });
    }

    if (!user.isBlocked) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    user.isBlocked = false;
    await user.save();

    res.json({ message: "User unblocked successfully", user });

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.destroy({ where: { id}}); // delete

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
}