export function initSocketHandlers(io) {
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
