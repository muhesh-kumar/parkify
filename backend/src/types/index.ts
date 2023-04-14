import { Request } from 'express';
import { Server } from 'socket.io';

export interface CustomRequest extends Request {
  io: Server;
}
