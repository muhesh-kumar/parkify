import { Response, NextFunction } from 'express';

import Request from '@interfaces/request';
import redis from '@config/db';
import HttpError from '@utils/http-error';
import { NUM_PARKING_SLOTS } from '@constants/index';

export const getParkingSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let availableParkingSlots: number[] = [];
  try {
    const values = await redis.smembers('availableSlots');
    availableParkingSlots = values.map((value: string) => parseInt(value, 10));
  } catch (error) {
    console.error('Error fetching set values:', error);
    throw new Error('Error fetching set values');
  }
  res.json({ availableParkingSlots });
};

export const resetParkingSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const io = req.io;

  const addValueToSet = async (
    setName: string,
    value: number
  ): Promise<number> => {
    try {
      const result = await redis.sadd(setName, value.toString());
      return result;
    } catch (err) {
      console.error(`Error adding values to set ${setName}: `, err);
      throw err;
    }
  };

  for (let i = 1; i <= NUM_PARKING_SLOTS; i++) {
    await addValueToSet('availableSlots', i);
  }

  io.emit('redis-update', { message: 'Available Slots resetted' });

  res.status(201).json({ message: 'Parking Slots resetted successfully' });
};

export const bookParkingSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const io = req.io;
  const { id } = req.params;

  try {
    const result = await redis.srem('availableSlots', id);
    if (result === 1) {
      res.status(200).json({ message: 'ID removed from set' });
      io.emit('redis-update', {
        message: 'AvailableSlots changed after booking',
      });
    } else {
      res.status(404).json({ message: 'ID not found in set' });
    }
  } catch (err) {
    console.error(err);
    const error = new HttpError('Unable to remove ID from set', 500);
    return next(error);
  }
};

export const freeParkingSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const io = req.io;
  const { id } = req.params;

  try {
    const result = await redis.sadd('availableSlots', id);
    if (result === 1) {
      res.status(200).json({ message: 'ID freed and added to set' });
      io.emit('redis-update', {
        message: 'AvailableSlots changed after freeing',
      });
    } else {
      res.status(404).json({ message: 'ID not added to set' });
    }
  } catch (err) {
    console.error(err);
    const error = new HttpError('Unable to free ID and add to set', 500);
    return next(error);
  }
};
