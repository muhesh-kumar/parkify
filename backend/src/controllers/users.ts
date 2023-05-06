import { Response, NextFunction } from 'express';
import { Request } from 'types';

import redis from '@config/db';
import HttpError from '@utils/http-error';
import { User } from 'types/index';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let users: Record<string, User> = {};

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
      if (key.startsWith('user')) users[key] = JSON.parse(values[i]!) as User;
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Unable to fetch the events', 500);
    return next(error);
  }

  if (Object.keys(users).length === 0) {
    const error = new HttpError('Could not find any events', 404);
    return next(error);
  }

  res.json({ users });
};
