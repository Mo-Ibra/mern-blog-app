const jwt = require("jsonwebtoken");
const BlockedToken = require("../models/blockedToken");
const { Op } = require("sequelize");

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  // Check if token is blocked
  const blockedToken = await BlockedToken.findOne({ where: { token }, attributes: ['expiredAt'] });
  const now = new Date();


  if (blockedToken) {
    // Token is blocked but not expired
    if (blockedToken.expiredAt > now) {
      return res.status(401).json({ message: 'Token is blocked' });
    } else {
      // Token is blocked and expired
      await BlockedToken.destroy({ where: { token } });
    }
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403) // Forbidden
  }
}

const cleanBlockedTokens = async () => {
  const now = new Date();
  await BlockedToken.destroy({ where: { expiredAt: { [Op.lt]: now } } });
}

setInterval(cleanBlockedTokens, 2 * 60 * 60 * 1000); // Clean blocked tokens every 2 hours

module.exports = authenticateToken;