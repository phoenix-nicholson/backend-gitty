const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Posts');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    const posts = await Post.getPosts();
    res.send(posts);
  })
  .post('/', authenticate, async (req, res, next) => {
    const user = await Post.insertPost(req.body);
    res.send(user);
  });
