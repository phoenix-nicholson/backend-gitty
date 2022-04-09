const app = require('../lib/app');
const request = require('supertest');
const pool = require('../lib/utils/pool');
const setup = require('../data/setup');

describe('backend-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  it('should get a list of quotes from an array of api', async () => {
    const expected = [
      {
        author: expect.any(String),
        content: expect.any(String),
      },
      {
        author: expect.any(String),
        content: expect.any(String),
      },
      {
        author: expect.any(String),
        content: expect.any(String),
      },
    ];
    const res = await request(app).get('/api/v1/quotes');
    expect(res.body).toEqual(expected);
  });
});
