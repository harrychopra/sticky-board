import cors from 'cors';
import express from 'express';

import {
  boardRouter
} from './routes/index.routes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/boards', boardRouter);

app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    resource: req.path,
    method: req.method,
    stack: err.stack
  });

  res.status(500).json({ error: 'Internal server error' });
});

export default app;
