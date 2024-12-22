const Comment = require('../../models/comments');
const Article = require('../../models/article');
const User = require('../../models/user');

/** CRUD Comment Controller */


/** Get All Comments */
exports.getAllComments = async (req, res) => {

  try {

    const comments = await Comment.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }, { model: Article, attributes: [ 'title' ]}],
    });

    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }

    res.status(200).json(comments);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.getCommentsInSpecificArticle = async (req, res) => {
  const { id } = req.params;

  try {

    // Check if article exists
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comments = await Comment.findAll({ where: { createdInArticle: id}, include: [{ model: User, attributes: ['name', 'email'] }, { model: Article, attributes: [ 'title' ]}] });

    // If there are no comments
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments in this article" });
    }

    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.getCommentById = async (req, res) => {
  const { id } = req.params;

  try {

    const comment = await Comment.findByPk(id, { include: [{ model: User, attributes: ['name', 'email'] }, { model: Article, attributes: [ 'title' ]}] });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.deleteComment = async (req, res) => {
  const  { id } = req.params;

  try {

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.destroy();

    res.status(204).send();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

exports.deleteAllComments = async (req, res) => {
  try {

    // Check first if Comment have rows
    const comments = await Comment.findAll();
    
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }
    
    await Comment.destroy({ truncate: true});

    res.status(204).send();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}