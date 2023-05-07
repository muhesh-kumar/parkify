import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Request from '@interfaces/request';
import Event from '@interfaces/event';
import redis from '@config/db';
import HttpError from '@utils/http-error';
import { resetParkingSlots } from './parking-slots';

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let events: Event[] = [];

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
        events.push({ licensePlateNumber: key, ...JSON.parse(values[i]!) });
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

  let createdEvent:Event;
  try {
    const { entryTimeStamp } = req.body;
    console.log(entryTimeStamp);
    // TODO: receive it from the RPi itself
    const plateNumber = Math.floor(Math.random() * 1000000000).toString(36);
    // const plateNumber = 'ABC-123-WW-45'; // TODO: receive it from the RPi itself

    const nextAvailableParkingSlot = await getNextAvailableParkingSlot();
    console.log('next available slot: ', nextAvailableParkingSlot);
    createdEvent = {
      licensePlateNumber: plateNumber,
      entryTimeStamp,
      carImageLocation: '/upload/test.jpg',
      nextAvailableParkingSlot: nextAvailableParkingSlot,
      // carImageLocation: req.file.path,
    };

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

    io.emit('redis-update', createdEvent);
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to create a new event', 422);
    res.status(422).json({ message: 'Unable to create a new event' });
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

export const getNextAvailableParkingSlot = async (): Promise<string | null> => {
  const members = await redis.smembers('availableSlots');
  return members.length > 0 ? members[0] : '';
};
