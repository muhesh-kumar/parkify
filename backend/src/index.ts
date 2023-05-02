import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import http from 'http';
import express, { Response, NextFunction } from 'express';
import { Server, Socket } from 'socket.io';
import bodyParser from 'body-parser';

import { Request } from 'types';
import HttpError from '@utils/http-error';
import eventRoutes from '@routes/events';
import parkingSlotsRoutes from '@routes/parking-slots';
import redis from '@lib/redis-client';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

declare module 'express-serve-static-core' {
  interface Request {
    io: Server;
  }
}

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.io = io;
  return next();
});
app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// delete all the keys in a redis using ioredis package
const deleteAllKeys = async () => {
  try {
    const keys = await redis.keys('*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Error deleting keys:', error);
    throw new Error('Error deleting keys');
  }
};
// deleteAllKeys();

app.get('/api', (req: Request, res: Response, next: NextFunction) => {
  res.send({ status: 'ok' });
});
app.use('/api/events', eventRoutes);
app.use('/api/parking-slots', parkingSlotsRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError('could not find this route.', 404);
  error.status = 404;
  next(error);
  throw error;
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('redis-update', (data) => {
    io.emit('redis-update', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
