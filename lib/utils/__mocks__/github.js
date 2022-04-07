const fetch = require('cross-fetch');

const exchangeCodeForToken = (code) => {
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  }).then(({ access_token }) => resp.json());
  return access_token;
};

const getGithubProfile = async (token) => {
  console.log(`MOCK INVOKED: getGithubProfile(${token})`);
  return {
    login: 'fake_github_user',
    avatar_url: 'https://www.placecage.com/gif/300/300',
    email: 'not-real@example.com',
  };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
