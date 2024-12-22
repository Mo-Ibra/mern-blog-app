const express = require('express');
const articleController = require('../../controllers/admin/articlesController');
const authenticateToken = require('../../middleware/authenticateToken');
const isAdmin = require('../../middleware/isAdmin');
const router = express.Router();

router.use(authenticateToken, isAdmin);

/** Article Routes */
router.get('/', articleController.getAllArticles);
router.get('/search', articleController.searchArticles);
router.get('/article/:id', articleController.getArticleById);
router.delete('/:id', articleController.deleteArticle);
router.delete('/all', articleController.deleteAllArticles);

module.exports = router