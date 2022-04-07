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
  })
    .then((resp) => resp.json())
    .then(({ access_token }) => access_token);
};

const getGithubProfile = async (token) => {
  const profileResp = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  const { avatar_url, login } = await profileResp.json();
  return {
    username: login,
    photoUrl: avatar_url,
  };
};
module.exports = { exchangeCodeForToken, getGithubProfile };
