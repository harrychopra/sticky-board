let io;

export function registerSocketHandlers(instance) {
  io = instance;

  io.on('connection', socket => {
    socket.on('join:board', ({ boardId, username }) => {
      socket.join(boardId);
      socket.data.boardId = boardId;
      socket.data.username = username;

      socket.to(boardId).emit('user:joined', { username });

      const usernames = getUsernamesByBoardId(boardId);
      io.to(boardId).emit('userPresence:update', { usernames });
    });

    socket.on('disconnect', () => {
      const { boardId, username } = socket.data;
      if (boardId && username) {
        socket.to(boardId).emit('user:left', { username });

        const usernames = getUsernamesByBoardId(boardId);
        io.to(boardId).emit('userPresence:update', { usernames });
      }
    });
  });
}

function getUsernamesByBoardId(boardId) {
  const clients = io.sockets.adapter.rooms.get(boardId);
  if (!clients) return [];

  const usernames = [...clients].map(id =>
    io.sockets.sockets.get(id)?.data.username
  );

  return usernames.filter(Boolean);
}
