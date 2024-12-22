const BlockedToken = require('../models/blockedToken');

/** Blocked Token Service */

const createBlockedToken = async (token, duration) => {
  const expiredAt = new Date(Date.now() + duration);
  await BlockedToken.create({ token, expiredAt });
}

module.exports = createBlockedToken;