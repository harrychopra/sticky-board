import express from 'express';
import {
  createNote,
  deleteNote,
  updateNote
} from '../controllers/notes.controller.js';

const router = express.Router();

router.route('/').post(createNote);
router.route('/:id').delete(deleteNote).patch(updateNote);

export default router;
