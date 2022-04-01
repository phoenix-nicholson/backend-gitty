const authenticate = require('../middleware/authenticate');
const Post = require('../models/Posts');

module.exports = Router().get('/', authenticate, async (req, req, next) => {
  const posts = await Post.getPosts();
  res.send(posts);
});
