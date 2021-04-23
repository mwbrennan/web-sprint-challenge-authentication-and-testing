const request = require('supertest');
const server = require('../api/server');
const db = require('../data/dbConfig');

// Write your tests here

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async () => {
  await db.destroy();
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('server.js', () => {
  describe('[POST] /api/auth/register', () => {
    it('creates a new user', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'bob', password: 'password' });
      const bob = await db('users').where('username', 'bob').first();
      expect(bob).toMatchObject({ username: 'bob' })
    })
    it('responds with right status on successful registration', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'jim', password: 'password' })
      expect(res.status).toBe(201);
    })
  })
})

describe('[GET] /api/jokes', () => {
  it('reject requests without token', async () => {
    const response = await request(server).get('/api/jokes');
    expect(response.body.message).toEqual('token required')
  })

  it('successfully retrieves jokes with token', async () => {
      const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', 'xyz');
    expect(res.body.message).toMatch(/token invalid/i);
  })
})
