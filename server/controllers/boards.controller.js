import Board from '../models/boards.model.js';
import Note from '../models/notes.model.js';

export const getBoards = async (req, res) => {
  const boards = await Board.findAll();
  res.status(200).json(boards.map(board => board.serialize()));
};

export const getBoard = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id);
  if (!board) return res.status(404).json({ error: 'Board not found' });

  const notes = await Note.findByBoardId(id);
  res.status(200).json({
    ...board.serialize(),
    notes: notes.map(note => note.serialize())
  });
};

export const createBoard = async (req, res) => {
  const { name, pin, template } = req.body;
  const board = await Board.create({ name: name.trim(), pin, template });
  res.status(201).json(board.serialize());
};

export const deleteBoard = async (req, res) => {
  const deleted = await Board.deleteById(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Board not found.' });
  res.status(204).send();
};
