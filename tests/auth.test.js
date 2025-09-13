const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  it('should return 200 for /api/auth/test', async () => {
    const res = await request(app).get('/api/auth/test');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Auth routes working!');
  });
});