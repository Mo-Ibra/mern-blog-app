const Article = require('../models/article');
const Comment = require('../models/comments');
const User = require('../models/user');


// Get All Comments
exports.getAllComments = async (req, res) => {
  try {

    const comments = await Comment.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }, { model: Article, attributes: [ 'title' ]}],
    });

    res.status(200).json(comments);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Get Comments in specific article
exports.getCommentsInSpecificArticle = async (req, res) => {
  const { id } = req.params;

  try {

    // Check if article exists
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comments = await Comment.findAll({
      where: { createdInArticle: id},
      include: [{
        model: User,
        attributes: ['name', 'email'] },
        { model: Article, attributes: [ 'title' ]}],
      });

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


// Get Comment by ID
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


// Create new comment
exports.createNewComment = async (req, res) => {
  try {

    const articleId  = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (content.length < 10) {
      return res.status(400).json({ message: "Content must be at least 10 characters long" });
    }

    const userId = req.user.id;

    const findArticle = await Article.findByPk(articleId);

    if (!findArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check if user is blocked
    const user = await User.findByPk(userId);
    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked!" });
    }

    const comment = await Comment.create({ content, createdInArticle: articleId, createdBy: userId});

    res.status(201).json(comment);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Update comment
exports.updateComment = async (req, res) => {
  const { id } = req.params;

  const { content } = req.body;

  try {

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.createdBy !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this comment" })
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (content.length < 10) {
      return res.status(400).json({ message: "Content must be at least 10 characters long" });
    }

    // Check if user is blocked
    const user = await User.findByPk(req.user.id);
    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked!" });
    }

    await comment.update({ content });

    res.status(200).json(comment);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

// Delete Comment
exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.createdBy !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" })
    }

    // Check if user is blocked
    const user = await User.findByPk(req.user.id);
    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked!" });
    }

    await comment.destroy();

    res.sendStatus(204);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}