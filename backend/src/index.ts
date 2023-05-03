import { Socket } from 'socket.io';

import { io, server } from 'server';

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('redis-update', (data: any) => {
    io.emit('redis-update', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening: http://localhost:3000');
});
