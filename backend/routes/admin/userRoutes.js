const express = require('express');
const userController = require('../../controllers/admin/userController');
const authenticateToken = require('../../middleware/authenticateToken');
const isAdmin = require('../../middleware/isAdmin');
const router = express.Router();

router.use(authenticateToken, isAdmin);

/** Prefix: admin/users */

/** User Routes */
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createNewUser);
router.put('/:id', userController.updateUser);
router.put('/:id/block', userController.blockUser);
router.put('/:id/unblock', userController.unblockUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;