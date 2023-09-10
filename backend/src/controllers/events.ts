import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import Request from '@interfaces/request';
import Event from '@interfaces/event';
import redis from '@config/db';

import HttpError from '@utils/http-error';
import { getNextAvailableParkingSlot } from '@utils/parking-slot';
import getRandomLicensePlateNumber from '@utils/get-random-license-plate-number';

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
      if (key !== 'availableSlots' && key.startsWith('ev_'))
        events.push({ licensePlateNumber: key, ...JSON.parse(values[i]!) });
    });
  } catch (err) {
    console.error(err);
    const message = 'Unable to fetch the events';
    // res.status(500).json({ status: 'fail', message });
    return next(new HttpError(message, 500));
  }

  if (Object.keys(events).length === 0) {
    const message = 'Could not find any events';
    // res.status(404).json({ status: 'fail', message });
    return next(new HttpError(message, 404));
  }

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: { events },
  });

  console.log('printing after events');
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { io } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid data provided', 422);
    return next(error);
  }

  let createdEvent: Event;
  try {
    const { timeStamp, isEntry, licensePlateNumber } = req.body;
    // const plateNumber = getRandomLicensePlateNumber();
    const nextAvailableParkingSlot = await getNextAvailableParkingSlot();

    if (!nextAvailableParkingSlot) {
      res.status(422).json({ message: 'No parking slots available' });
      return next();
    }

    createdEvent = {
      id: `ev_${uuidv4()}`,
      licensePlateNumber,
      // licensePlateNumber: plateNumber,
      timeStamp,
      carImageLocation: '/upload/test.jpg',
      isEntry,
    };

    // add the event
    const eventResult = await redis.set(
      createdEvent.id,
      JSON.stringify(createdEvent)
    );

    if (isEntry) {
      // store the licenseplate along with allocated parking slot for easy removal during vehicle exit
      const carResult = await redis.set(
        `car_${createdEvent.licensePlateNumber}`,
        nextAvailableParkingSlot
      );
      // Vehicle entering => allocate a free slot
      if (nextAvailableParkingSlot && eventResult && carResult) {
        const parkingSlotResult = await redis.srem(
          'availableSlots',
          nextAvailableParkingSlot
        );
        if (!parkingSlotResult)
          return next(new HttpError('Unable to create a new event', 422));
      }
    } else {
      // Vehicle exiting => free the allocated slot
      const allocatedParkingSlot = await redis.get(
        `car_${createdEvent.licensePlateNumber}`
      );
      const parkingSlotResult = await redis.sadd(
        'availableSlots',
        allocatedParkingSlot!
      );
      if (!parkingSlotResult)
        return next(new HttpError('Unable to create a new event', 422));
    }

    io.emit('redis-update', createdEvent);
  } catch (err) {
    console.error(err);
    return next(new HttpError('Unable to create a new event', 422));
  }

  res.status(201).json({ status: 'success', data: { event: createdEvent } });
};

// Only for Testing purposes(i.e., client shouldn't call this)
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { licensePlateNumber } = req.params;
  const { io } = req;

  try {
    const createdEvent = await redis.get(licensePlateNumber);
    const eventResult = await redis.del(licensePlateNumber);

    // Free the parking slot that was allocated
    const bookedParkingSlot = JSON.parse(
      createdEvent!
    ).nextAvailableParkingSlot;
    const parkingSlotResult = await redis.sadd(
      'availableSlots',
      bookedParkingSlot
    );

    if (eventResult && parkingSlotResult) {
      io.emit('redis-update', createdEvent);
      res.status(204).json({ status: 'success', data: null });
    } else {
      res
        .status(500)
        .json({ status: 'fail', message: 'Unable to delete the given event' });
    }
  } catch (err) {
    const message = 'Unable to delete the given event';
    res.status(500).json({ status: 'fail', message });
    return next(new HttpError(message, 500));
  }
};

export const validateCreateEventRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { timeStamp, licensePlateNumber } = req.body;
  if (
    !timeStamp ||
    !req.body.hasOwnProperty('isEntry') || // because isEntry is a boolean
    !licensePlateNumber
  ) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Invalid data provided' });
  }
  next();
};
