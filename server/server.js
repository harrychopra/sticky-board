import http from 'http';
import app from './app.js';
import { initSocket } from './socket.js';

const { PORT = 9090 } = process.env;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening on ${PORT}...`);
});

export default server;
