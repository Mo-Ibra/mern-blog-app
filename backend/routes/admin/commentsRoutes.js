const express = require('express');
const commentController = require('../../controllers/admin/commentsController');
const authenticateToken = require('../../middleware/authenticateToken');
const isAdmin = require('../../middleware/isAdmin');
const router = express.Router();

router.use(authenticateToken, isAdmin);

// Comments Routes
router.get('/', commentController.getAllComments);
router.get('/article/:id', commentController.getCommentsInSpecificArticle);
router.get('/:id', commentController.getCommentById);
router.delete('/:id', commentController.deleteComment);
router.delete('/delete/all', commentController.deleteAllComments);

module.exports = router;