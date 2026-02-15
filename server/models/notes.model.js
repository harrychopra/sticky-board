import Note from './note.model.js';

class Notes {
  constructor(notes) {
    this.notes = notes.map(note => new Note(note));
  }

  toJSON() {
    return this.notes.map(note => note.toJSON());
  }
}

export default Notes;
