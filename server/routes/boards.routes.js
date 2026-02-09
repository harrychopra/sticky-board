import express from 'express';

import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoards
} from '../controllers/boards.controller.js';

const router = express.Router();

router.route('/').get(getBoards).post(createBoard);
router.route('/:id').get(getBoard).delete(deleteBoard);

export default router;
