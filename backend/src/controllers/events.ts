import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Request from '@interfaces/request';
import redis from '@config/db';
import HttpError from '@utils/http-error';

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
    const keys = [];
    let cursor = '0';

    do {
      const res = await redis.scan(cursor);
      cursor = res[0];
      const batchKeys = res[1];
      keys.push(...batchKeys);
    } while (cursor !== '0');

    const values = await redis.mget(...keys);
    keys.forEach((key, i) => {
      if (key !== 'availableSlots')
        events[key] = JSON.parse(values[i]!) as Event;
    });
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
  console.log('Entered POST Request: ', req.body);

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid data provided', 422);
    return next(error);
  }

  const { entryTimeStamp } = req.body;
  console.log(entryTimeStamp);
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
