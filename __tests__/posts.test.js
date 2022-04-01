const setup = require('../data/setup');
const app = require('../lib/app');
const request = require('supertest');
const pool = require('../lib/utils/pool');

jest.mock('../lib/utils/github');

describe('backend-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to get all posts', async () => {
    const agent = request.agent(app);
    await request(app).get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const post1 = {
      id: expect.any(String),
      text: 'post one',
    };
    const post2 = {
      id: expect.any(String),
      text: 'post two',
    };

    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([post1, post2]);
  });

  it('should be able to create a 255 char post if signed in', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    await agent.get('/login/callback');

    const res = await agent.post('/api/v1/posts/create').send({ text: 'post' });

    expect(res.body).toEqual({
      id: expect.any(String),
      text: 'post',
    });
  });
});
