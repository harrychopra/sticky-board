import { requestAPI } from './api.js';
const canvas = document.getElementById('boardCanvas');
const socket = io();

function getBoardId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function setupBoard(boardId) {
  const req = {
    method: 'GET',
    url: `/api/boards/${boardId}`,
    ctx: 'load board'
  };

  const [board, err] = await requestAPI(req);
  if (err !== null) return;

  document.getElementById('boardTitle').textContent = board.name;
  document.title = `${board.name} - StickyBoard`;

  socket.emit('join:board', boardId);

  registerNoteAdder(boardId);

  board.notes.forEach(note => renderNote(note));
}

function registerNoteAdder(boardId) {
  const addNoteBtn = document.getElementById('addNoteBtn');
  addNoteBtn.addEventListener('click', async () => {
    const req = {
      method: 'POST',
      url: `/api/notes`,
      payload: {
        board_id: boardId,
        pos_x: 80 + parseInt(Math.random() * 200),
        pos_y: 80 + parseInt(Math.random() * 200)
      },
      ctx: 'add note'
    };

    const [note, err] = await requestAPI(req);
    if (err !== null) return;

    renderNote(note);
  });
}

function renderNote({ id, pos_x, pos_y, colour, author, text }) {
  const noteEl = document.createElement('div');
  noteEl.className = 'note';
  noteEl.dataset.id = id;
  noteEl.style.left = pos_x + 'px';
  noteEl.style.top = pos_y + 'px';
  noteEl.style.backgroundColor = colour;

  noteEl.innerHTML = `
    <div class="note-header">
      <div class="note-author">${author}</div>
      <button class="note-delete">×</button>
    </div>
    <textarea class="note-body" placeholder="Type something...">${text}</textarea>
  `;

  registerNoteMover(noteEl);
  registerNoteSaver(noteEl);
  registerNoteRemover(noteEl);
  canvas.appendChild(noteEl);
}

const getTopZ = (() => {
  let topZ = 0;
  return (() => ++topZ);
})();

function registerNoteMover(noteEl) {
  let dragging = false;
  let startX, startY, startLeft, startTop;

  noteEl.addEventListener('mousedown', e => {
    // bring the note to foreground
    noteEl.style.zIndex = getTopZ();

    // for dragging, ignore any click inside the text area
    const tag = e.target.tagName;
    if (tag === 'TEXTAREA' || tag === 'BUTTON') return;

    dragging = true;

    // where the mouse is on screen when clicked
    startX = e.clientX;
    startY = e.clientY;

    // where is note is on canvas when clicked
    startLeft = parseInt(noteEl.style.left);
    startTop = parseInt(noteEl.style.top);
  });

  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    // ignore the mouse movements if no mouse down
    if (!dragging) return;

    // add distance the mouse has traveled to note's original coordinates,
    noteEl.style.left = (startLeft + (clientX - startX)) + 'px';
    noteEl.style.top = (startTop + (clientY - startY)) + 'px';
  });

  document.addEventListener('mouseup', async ({ clientX, clientY }) => {
    if (!dragging) return;
    dragging = false;

    // If the mouse hasn't traveled, skip re-saving the note position
    if (startX === clientX && startY === clientY) return;

    const id = noteEl.dataset.id;
    const pos_x = parseInt(noteEl.style.left);
    const pos_y = parseInt(noteEl.style.top);

    const req = {
      method: 'PATCH',
      url: `/api/notes/${id}`,
      payload: { pos_x, pos_y },
      ctx: 'save note position'
    };

    await requestAPI(req);
  });
}

function registerNoteSaver(noteEl) {
  const textarea = noteEl.querySelector('.note-body');

  textarea.addEventListener('blur', async () => {
    const id = noteEl.dataset.id;
    const text = textarea.value;

    const req = {
      method: 'PATCH',
      url: `/api/notes/${id}`,
      payload: { text },
      ctx: 'save note text'
    };

    await requestAPI(req);
  });
}

function registerNoteRemover(noteEl) {
  const deleteBtn = noteEl.querySelector('.note-delete');

  deleteBtn.addEventListener('click', async () => {
    const id = noteEl.dataset.id;

    const req = {
      method: 'DELETE',
      url: `/api/notes/${id}`,
      ctx: 'delete note'
    };

    const [_, err] = await requestAPI(req);
    if (err !== null) return;

    noteEl.remove();
  });
}

function initSocketListeners() {
  socket.on('note:created', note => {
    renderNote(note);
  });
  socket.on('note:updated', note => {
    const noteEl = canvas.querySelector(`[data-id="${note.id}"]`);
    if (!noteEl) return;

    noteEl.style.left = note.pos_x + 'px';
    noteEl.style.top = note.pos_y + 'px';
  });
}

async function init() {
  const boardId = getBoardId();
  if (!boardId) window.location.href = '/';

  await setupBoard(boardId);

  initSocketListeners();
}

init();

// TODO : z-index preserve
