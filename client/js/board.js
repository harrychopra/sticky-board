import { requestAPI } from './api.js';
import { generateUsername, showToast } from './utils.js';

const state = { boardId: null, username: null, selectedColor: null };
const socket = io();
const canvas = document.getElementById('boardCanvas');
let topZ = 0;

function initState() {
  const params = new URLSearchParams(window.location.search);
  state.boardId = params.get('id');
  if (!state.boardId) window.location.href = '/';

  state.username = localStorage.getItem('username') || generateUsername();
  localStorage.setItem('username', state.username);

  state.selectedColor = localStorage.getItem('selectedColor') || '#FFEB3B';
}

function setupColorPicker() {
  document.querySelectorAll('.color-tile').forEach(tile =>
    tile.dataset.color === state.selectedColor
      ? tile.classList.add('active')
      : tile.classList.remove('active')
  );

  const picker = document.getElementById('colorPicker');
  picker.addEventListener('click', e => {
    const colorTile = e.target.closest('.color-tile');
    if (!colorTile) return;

    document.querySelectorAll('.color-tile').forEach(tile =>
      tile.classList.remove('active')
    );

    colorTile.classList.add('active');
    state.selectedColor = colorTile.dataset.color;
    localStorage.setItem('selectedColor', state.selectedColor);
  });
}

async function getBoard() {
  const req = {
    method: 'GET',
    url: `/api/boards/${state.boardId}`,
    ctx: 'get board'
  };

  const [board, err] = await requestAPI(req);
  if (err !== null) {
    return;
  }

  return board;
}

async function setupBoard(board) {
  document.getElementById('boardTitle').textContent = board.name;
  document.title = `${board.name} - StickyBoard`;

  socket.emit('join:board', state);

  registerNoteAdder();
  setupColorPicker();

  board.notes.forEach(note => renderNote(note));
}

function registerNoteAdder() {
  const addNoteBtn = document.getElementById('addNoteBtn');
  addNoteBtn.addEventListener('click', async () => {
    const req = {
      method: 'POST',
      url: `/api/notes`,
      payload: {
        boardId: state.boardId,
        color: state.selectedColor,
        posX: 80 + parseInt(Math.random() * 200),
        posY: 80 + parseInt(Math.random() * 200),
        zIndex: ++topZ
      },
      ctx: 'add note'
    };

    const [note, err] = await requestAPI(req);
    if (err !== null) return;

    renderNote(note);
  });
}

function renderNote({ id, posX, posY, zIndex, color, author, text }) {
  const noteEl = document.createElement('div');
  noteEl.className = 'note';
  noteEl.dataset.id = id;
  noteEl.style.left = posX + 'px';
  noteEl.style.top = posY + 'px';
  noteEl.style.zIndex = zIndex;
  if (zIndex > topZ) topZ = zIndex;
  noteEl.style.backgroundColor = color;

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

async function updateZIndex(noteEl) {
  const id = noteEl.dataset.id;
  const zIndex = ++topZ;
  noteEl.style.zIndex = zIndex;

  const req = {
    method: 'PATCH',
    url: `/api/notes/${id}`,
    payload: { zIndex },
    ctx: 'save note stack order'
  };

  await requestAPI(req);
}

function registerNoteMover(noteEl) {
  let dragging = false;
  let startX, startY, startLeft, startTop;

  noteEl.addEventListener('mousedown', e => {
    // bring the note to foreground
    updateZIndex(noteEl);

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
    const posX = parseInt(noteEl.style.left);
    const posY = parseInt(noteEl.style.top);

    const req = {
      method: 'PATCH',
      url: `/api/notes/${id}`,
      payload: { posX, posY },
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

function registerSocketListeners() {
  socket.on('userPresence:update', ({ usernames }) => {
    const el = document.getElementById('userPresence');
    el.innerHTML = usernames.map(username => `
        <div class='avatar' title="${username}">
          ${username[0].toUpperCase()}
        </div>`).join('');
  });

  socket.on('user:joined', ({ username }) => {
    showToast(`${username} joined the board`);
  });

  socket.on('user:left', ({ username }) => {
    showToast(`${username} left the board`);
  });

  socket.on('note:created', note => {
    renderNote(note);
  });

  socket.on('note:updated', note => {
    const noteEl = canvas.querySelector(`[data-id="${note.id}"]`);
    if (!noteEl) return;

    noteEl.style.left = note.posX + 'px';
    noteEl.style.top = note.posY + 'px';
    noteEl.style.zIndex = note.zIndex;

    const textarea = noteEl.querySelector('.note-body');
    if (document.activeElement !== textarea) {
      textarea.value = note.text;
    }
  });

  socket.on('note:deleted', ({ id: noteId }) => {
    canvas.querySelector(`[data-id="${noteId}"]`)?.remove();
  });
}

async function init() {
  initState();
  const board = await getBoard();
  if (!board) {
    window.location.href = '/';
    return;
  }

  setupBoard(board);
  registerSocketListeners();
}

init();

// TODO : z-index preserve
