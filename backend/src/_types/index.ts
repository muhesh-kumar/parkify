import { Server } from 'socket.io';

declare module 'express-serve-static-core' {
  export default interface Request {
    io: Server;
  }
}
