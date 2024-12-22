const User = require("../models/user");

const isAdmin = async (req, res, next) => {
  try {

    const { id } = req.user;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "You are not an admin to access" })
    }

    next();

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error", error: err.message })
  }
}

module.exports = isAdmin;