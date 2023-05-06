import { Response, NextFunction } from 'express';

import redis from '@config/db';
import { Request } from 'types';

export const deleteKeys = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const keys = await redis.keys('*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    throw new Error('Error deleting keys');
  }
  res.json({ message: 'All keys are deleted from the Redis DB' });
};
