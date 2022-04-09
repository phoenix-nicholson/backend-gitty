const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const { getGithubProfile, exchangeCodeForToken } = require('../utils/github');
const jwt = require('jsonwebtoken');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res, next) => {
    try {
      res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
      );
    } catch (error) {
      next(error);
    }
  })
  .get('/login/callback', (req, res, next) => {
    const { code } = req.query;
    let profile;
    return exchangeCodeForToken(code)
      .then((token) => getGithubProfile(token))
      .then(({ username, photoUrl, email }) => {
        profile = { username, photoUrl, email };
        return GithubUser.findByUsername(username);
      })
      .then((user) => {
        if (user) {
          return user;
        } else {
          return GithubUser.insert({
            username: profile.username,
            avatar: profile.photoUrl,
            email: profile.email,
          });
        }
      })
      .then((user) => {
        const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
          expiresIn: '1 day',
        });

        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .redirect('/api/v1/posts');
      })
      .catch((error) => next(error));
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ message: 'Signed out successfully' });
  });
