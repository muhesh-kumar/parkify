import express, { Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import morgan from 'morgan';

import eventRoutes from '@routes/events';
import parkingSlotsRoutes from '@routes/parking-slots';
import redisKeysRoutes from '@routes/redis-keys';
import authRoutes from '@routes/auth';
import userRoutes from '@routes/user';
import otherRoutes from '@routes/other';

import { Request } from 'types';
import { io } from '@config/server';
import setupPassport from '@config/passport';
import swaggerSpec from '@config/swagger';
import HttpError from '@utils/http-error';

/* ---------------- */
/* Configs */
/* ---------------- */

dotenv.config({ path: './src/config/config.env' });
setupPassport(passport);
const app = express();

declare module 'express-serve-static-core' {
  interface Request {
    io: Server;
  }
}

/* ---------------- */
/* Middlewares */
/* ---------------- */

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.io = io;
  return next();
});

app.use(express.urlencoded({ extended: false }));
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

app.set('trust proxy', 1);
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

/* ---------------- */
/* Routes */
/* ---------------- */

app.use('/api/events', eventRoutes);
app.use('/api/parking-slots', parkingSlotsRoutes);
app.use('/api/redis-keys', redisKeysRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/', otherRoutes);
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
