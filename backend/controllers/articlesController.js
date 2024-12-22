const { Op } = require('sequelize');
const Article = require('../models/article');
const User = require('../models/user');
const Comment = require('../models/comments');

/** CRUD Article Controller */

// Get All Articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
    });
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.getArticlesByUser = async (req, res) => {
  const { id } = req.params;
  try {

    const articles = await Article.findAll({ where: { createdBy: id }, include: [{ model: User, attributes: ['name', 'email'] }] });

    res.status(200).json(articles);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Search Articles by title or content
exports.searchArticles = async (req, res) => {
  const { title }= req.query;

  try {

    const articles = await Article.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${title}%` } },
          { content: { [Op.like]: `%${title}%` } }
        ]
      }, include: [{ model: User, attributes: ['name', 'email'] }],
    });

    res.status(200).json(articles);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Get article by ID
exports.getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findByPk(id, {
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    // If article not found
    if (!article) {
      return res.status(404).json({ message: "Article not found!"});
    }

    res.status(200).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Create new article
exports.createNewArticle = async (req, res) => {
  const { title, content } = req.body;

  try {

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required!"});
    }

    const userId = req.user.id;

    // Check if user is blocked
    const user  = await User.findByPk(userId);
    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked!"});
    }

    const article = await Article.create({ title, content, createdBy: userId });

    res.status(201).json(article);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Update an artilce with ID
exports.updateArticle = async (req, res) => {
  const { id } = req.params;

  const { title, content } = req.body;

  try {

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found!"});
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required!"});
    }

    if (article.createdBy !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this article!"});
    }

    // Check if user is blocked
    const user  = await User.findByPk(req.user.id);
    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked!"});
    }

    await article.update({ title, content });

    res.status(200).json(article);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Delete an article
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found!"});
    }

    if (article.createdBy !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this article!"});
    }

    // Check if user is blocked
    const user  = await User.findByPk(req.user.id);
    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked!"});
    }

    await article.destroy();

    res.status(204).send();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}