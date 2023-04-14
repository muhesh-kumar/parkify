import { Request as ExpressRequest } from 'express';
import { Server } from 'socket.io';

export interface Request extends ExpressRequest {
  io: Server;
}
