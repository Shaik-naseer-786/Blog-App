const Post = require('../models/postModel');
const HttpError = require('../models/errorModel');

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content, user: req.user.id });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new HttpError('Post not found', 404));
    }
    if (post.user.toString() !== req.user.id) {
      return next(new HttpError('User not authorized', 401));
    }
    post.title = title || post.title;
    post.content = content || post.content;
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new HttpError('Post not found', 404));
    }
    if (post.user.toString() !== req.user.id) {
      return next(new HttpError('User not authorized', 401));
    }
    await post.remove();
    res.status(200).json({ message: 'Post removed' });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost
};
