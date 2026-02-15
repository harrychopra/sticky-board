import Board from '../models/board.model.js';
import Note from '../models/note.model.js';

export const getBoards = async (req, res) => {
  const boards = await Board.findAll();
  res.status(200).json(boards.toJSON());
};

export const getBoard = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id);
  console.log(board);

  if (!board) return res.status(404).json({ error: 'Board not found' });

  const notes = await Note.findByBoardId(id);
  res.status(200).json({
    ...board.toJSON(),
    notes: notes.toJSON()
  });
};

export const createBoard = async (req, res) => {
  const { name, pin, template } = req.body;
  const board = await Board.create({ name: name.trim(), pin, template });
  res.status(201).json(board.toJSON());
};

export const deleteBoard = async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).json({ error: 'Board not found' });

  await board.delete();
  res.status(204).send();
};
