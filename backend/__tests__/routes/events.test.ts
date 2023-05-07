import request from 'supertest';

import app from '../../src/app';
import { getNextAvailableParkingSlot } from '../../src/controllers/events';

describe('Test GET /api/events', () => {
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

describe('Test getNextAvailableParkingSlot function', () => {
  test('Should return a string between 1 and 162', async () => {
    const slot = await getNextAvailableParkingSlot();
    expect(slot).toBeDefined();
    expect(typeof slot).toBe('string');
    expect(Number(slot)).toBeGreaterThanOrEqual(1);
    expect(Number(slot)).toBeLessThanOrEqual(162);
  });
});

describe('POST /api/events', () => {
  it('Should create a new event', async () => {
    const entryTimeStamp = new Date().toISOString();

    const res = await request(app).post('/api/events').send({ entryTimeStamp });

    expect(res.status).toEqual(201);
    expect(res.body.event.licensePlateNumber).toBeDefined();
    expect(res.body.event.entryTimeStamp).toEqual(entryTimeStamp);
    expect(res.body.event.carImageLocation).toBeDefined();
    expect(res.body.event.nextAvailableParkingSlot).toMatch(/^\d+$/);
  });

  // it('should return 422 if invalid data is provided', async () => {
  //   const res = await request(app).post('/api/events').send({});
  //   expect(res.status).toEqual(422);
  // });
});
