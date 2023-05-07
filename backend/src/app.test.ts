import request from 'supertest';

import app from 'app';

describe('Test app.ts', () => {
  test('Server Health check', async () => {
    const res = await request(app).get('/');
    expect(res.body).toEqual({ message: 'Server is up and running!!!' });
  });
});
