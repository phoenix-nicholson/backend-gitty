const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const { getGithubProfile, exchangeCodeForToken } = require('../utils/github');
const jwt = require('jsonwebtoken');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res, next) => {
    try {
      res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
      );
    } catch (error) {
      next(error);
    }
  })
  .get('/login/callback', async (req, res, next) => {
    const { code } = req.query;
    const token = await exchangeCodeForToken(code);
    const { login, avatar_url, email } = await getGithubProfile(token);
    let user = await GithubUser.findByUsername(login);

    if (!user)
      user = await GithubUser.insert({
        username: login,
        avatar: avatar_url,
        email,
      });

    const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .redirect('/api/v1/posts');
  });
