import { Request as ExpressRequest } from 'express';
import { Server } from 'socket.io';

export default interface Request extends ExpressRequest {
  io: Server;
}
