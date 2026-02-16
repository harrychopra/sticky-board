import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { registerSocketHandlers } from './socket.js';

const { PORT = 9090 } = process.env;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

registerSocketHandlers(io);

app.set('io', io);

server.listen(PORT, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening on ${PORT}...`);
});

export default server;
