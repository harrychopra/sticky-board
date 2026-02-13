import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', socket => {
    console.log('client connected:', socket.id);

    socket.on('join:board', boardId => {
      socket.join(boardId);
      console.log(`${socket.id} joined ${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log('client disconnected', socket.id);
    });
  });
}

export { io };
