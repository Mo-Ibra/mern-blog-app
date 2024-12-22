const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');

const authController = require('..//controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authenticateToken , authController.getProfile);
router.post('/change-password', authenticateToken, authController.changePassword);
router.post('/change-name', authenticateToken, authController.changeName);
router.get('/logout', authenticateToken, authController.logout);
router.post('/delete-account', authenticateToken, authController.deleteAccount);

module.exports = router;