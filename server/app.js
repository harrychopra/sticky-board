import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'url';

import path from 'path';
import {
  boardRouter,
  noteRouter
} from './routes/index.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.use('/api/boards', boardRouter);
app.use('/api/notes', noteRouter);

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
