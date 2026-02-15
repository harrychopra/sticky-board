import Board from './board.model.js';

class Boards {
  constructor(boards) {
    this.boards = boards.map(board => new Board(board));
  }

  toJSON() {
    return this.boards.map(board => board.toJSON());
  }
}

export default Boards;
