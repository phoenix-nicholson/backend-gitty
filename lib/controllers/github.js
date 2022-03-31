const { default: fetch } = require('cross-fetch');
const { Router } = require('express');
const { getGitHubProfile } = require('../utils/github');

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
    const { login, avatar_url, email } = await getGitHubProfile(token);
  });
