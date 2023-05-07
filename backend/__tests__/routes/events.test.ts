import request from 'supertest';

import app from '../../src/app';

describe('Test getEvents function', () => {
  test('Should return events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.events).toBeDefined();

    const events: Event = res.body.events;
    Object.values(events).forEach((event) => {
      expect(event).toMatchObject<Event>(event);
    });
  });
});
