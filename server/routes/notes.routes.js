import express from 'express';
import { createNote, deleteNote } from '../controllers/notes.controller.js';

const router = express.Router();

router.route('/').post(createNote);
router.route('/:id').delete(deleteNote);

export default router;
