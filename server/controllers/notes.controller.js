import Board from '../models/board.model.js';
import Note from '../models/note.model.js';

export const createNote = async (req, res) => {
  const board = await Board.findById(req.body.boardId);
  if (!board) return res.status(404).json({ error: 'Board not found' });

  const note = await Note.create(req.body);
  req.app.get('io').to(note.boardId).emit('note:created', note);
  res.status(201).json(note.toJSON());
};

export const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });

  const updated = await note.update(req.body);
  req.app.get('io').to(updated.boardId).emit('note:updated', updated);
  res.json(updated.toJSON());
};

export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });

  await note.delete();
  req.app.get('io').to(note.boardId).emit('note:deleted', { id: note.id });
  res.status(204).send();
};
