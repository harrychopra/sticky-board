export function registerSocketHandlers(io) {
  io.on('connection', socket => {
    socket.on('join:board', ({ boardId, username }) => {
      socket.join(boardId);
      socket.data.boardId = boardId;
      socket.data.username = username;

      socket.to(boardId).emit('user:joined', { username });
    });

    socket.on('disconnect', () => {
      const { boardId, username } = socket.data;
      if (boardId && username) {
        socket.to(boardId).emit('user:left', { username });
      }
    });
  });
}
