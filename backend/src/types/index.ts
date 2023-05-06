import { Request as ExpressRequest } from 'express';
import { Server } from 'socket.io';

export interface Request extends ExpressRequest {
  io: Server;
}

export interface User {
  id: string;
  displayName: string;
  imageURL: string;
  createdAt: Date;
}
