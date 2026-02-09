import app from './app.js';

const { PORT = 9090 } = process.env;

app.listen(PORT, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening on ${PORT}...`);
});
