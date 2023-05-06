import { Socket } from 'socket.io';

import { io, server } from '@config/server';
import { PORT } from '@constants/index';

io.on('connection', (socket: Socket) => {
  socket.on('redis-update', (data: any) => {
    io.emit('redis-update', data);
  });

  socket.on('disconnect', () => {});
});

server.listen(3000, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
