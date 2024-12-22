const express = require('express');
const commentController = require('../controllers/commentsController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

/** Comment Controller */

router.get('/', commentController.getAllComments);
router.get('/article/:id', commentController.getCommentsInSpecificArticle);
router.get('/:id', commentController.getCommentById);
router.post('/article/:id', authenticateToken, commentController.createNewComment);
router.put('/:id', authenticateToken, commentController.updateComment);
router.delete('/:id', authenticateToken, commentController.deleteComment);

module.exports = router;