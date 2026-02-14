import Board from '../models/boards.model.js';
import Note from '../models/notes.model.js';

export const createNote = async (req, res) => {
  const { board_id } = req.body;
  const board = await Board.findById(board_id);
  if (!board) return res.status(404).json({ error: 'Board not found' });

  const note = await Note.create(req.body);
  req.app.get('io').to(note.board_id).emit('note:created', note);
  res.status(201).json(note.serialize());
};

export const deleteNote = async (req, res) => {
  const deleted = await Note.deleteById(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Note not found' });
  res.status(204).send();
};

export const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });

  const updated = await note.update(req.body);
  res.json(updated.serialize());
};
