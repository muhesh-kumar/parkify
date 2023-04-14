import { Response, NextFunction } from 'express';

import { Request } from '../types';
import { validationResult } from 'express-validator';
import HttpError from '../utils/http-error';
import redis from '../lib/redis-client';

interface Event {
  entryTimeStamp: string;
  carImageLocation: string;
  nextAvailableParkingSlot: string | null;
}

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let events: Record<string, Event> = {};

  try {
    // get all the keys and its corresponding value from redis
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', '*');
      cursor = nextCursor;

      for (const key of keys) {
        if (key !== 'availableSlots') {
          const value = await redis.get(key);
          events[key] = JSON.parse(value!) as Event;
        } else {
          console.log(`Unknown key`);
        }
      }
    } while (cursor !== '0');

    console.log('events: ', events);
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to fetch the events', 500);
    return next(error);
  }

  if (Object.keys(events).length === 0) {
    const error = new HttpError('Could not find any events', 404);
    return next(error);
  }

  res.json({ events: events });
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const io = req.io;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid data provided', 422);
    return next(error);
  }

  const { entryTimeStamp } = req.body;
  // TODO: receive it from the RPi itself
  const plateNumber = Math.floor(Math.random() * 1000000000).toString(36);
  // const plateNumber = 'ABC-123-WW-45'; // TODO: receive it from the RPi itself

  const nextAvailableParkingSlot = await getNextAvailableParkingSlot();
  console.log('next available slot: ', nextAvailableParkingSlot);
  const createdEvent: Event = {
    entryTimeStamp,
    carImageLocation: '/upload/test.jpg',
    nextAvailableParkingSlot,
    // carImageLocation: req.file.path,
  };

  try {
    // add the event
    const response = await redis.set(plateNumber, JSON.stringify(createdEvent));
    console.log('when adding the event to the db: ', response);

    // book the slot
    if (nextAvailableParkingSlot) {
      const result = await redis.srem(
        'availableSlots',
        nextAvailableParkingSlot
      );
      console.log('when booking a slot: ', result);
    }

    io.emit('redis-update', { plateNumber, ...createdEvent });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to create a new event', 500);
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

const getNextAvailableParkingSlot = async (): Promise<string | null> => {
  const members = await redis.smembers('availableSlots');
  return members.length > 0 ? members[0] : '';
};
