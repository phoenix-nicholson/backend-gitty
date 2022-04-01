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

  it.only('should be able to get all posts', async () => {
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
});
