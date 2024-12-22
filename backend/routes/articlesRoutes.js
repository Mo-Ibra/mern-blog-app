const express = require('express');
const articleController = require('../controllers/articlesController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

/** Article Controller */

router.get('/', articleController.getAllArticles);
router.get('/user/:id', articleController.getArticlesByUser);
router.get('/search', articleController.searchArticles);
router.get('/article/:id', articleController.getArticleById);
router.post('/', authenticateToken, articleController.createNewArticle);
router.put('/:id', authenticateToken, articleController.updateArticle);
router.delete('/:id', authenticateToken, articleController.deleteArticle);

module.exports = router