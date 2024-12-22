const { Op } = require('sequelize');
const Article = require('../../models/article');
const User = require('../../models/user');


exports.getAllArticles = async (req, res) => {
  try {

    const articles = await Article.findAll({ include: [{ model: User, attributes: ['name', 'email'] }] });

    res.status(200).json(articles);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.searchArticles = async (req, res) => {
  const { title } = req.query;

  try {

    const articles = await Article.findAll({ where: { title: { [Op.like ]: `%${title}%` }}, include: [{ model: User, attributes: ['name', 'email']}] });

    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    res.status(200).json(articles);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.getArticleById = async (req, res) => {

  const { id } = req.params;

  try {

    const article = await Article.findByPk(id, { include: [{ model: User, attributes: ['name', 'email'] }] });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.deleteArticle = async (req, res) => {

  const { id } = req.params;

  try {

    // Check if article exists
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await article.destroy();

    res.status(204).send();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.deleteAllArticles = async (req, res) => {
  try {

    // Check if Article have rows
    const articles = await Article.findAll();

    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    await Article.destroy({ truncate: true});

    res.status(204).send();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}