import express, { Response, NextFunction } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { Request } from 'types';
import { io } from 'server';
import HttpError from '@utils/http-error';
import eventRoutes from '@routes/events';
import parkingSlotsRoutes from '@routes/parking-slots';
import redisKeysRoutes from '@routes/redis-keys';

dotenv.config();
const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Parkify REST API',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from a remote RedisDB.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Muhesh Kumar',
      url: 'https://github.com/muhesh-kumar',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

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
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/events', eventRoutes);
app.use('/api/parking-slots', parkingSlotsRoutes);
app.use('/api/redis-keys', redisKeysRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

export default app;
