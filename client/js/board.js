import { logError, showToast } from './utils.js';

const params = new URLSearchParams(window.location.search);
const boardId = params.get('id');
if (!boardId) window.location.href = '/';

const canvas = document.getElementById('boardCanvas');

async function loadBoard() {
  const [method, url, ctx] = ['GET', `/api/boards/${boardId}`, 'loading board'];

  try {
    const res = await fetch(url);
    if (!res.ok) {
      logError(ctx, `${method} ${url} failed with status ${res.status}`);
      showToast('Board not found', true);
      return null;
    }
    const board = await res.json();
    document.getElementById('boardTitle').textContent = board.name;
    document.title = `${board.name} - StickyBoard`;
    return board;
  } catch (err) {
    logError(ctx, err);
    showToast('Could not reach the server', true);
  }
}

async function saveNotePosition(id, pos_x, pos_y) {
  const [method, url, ctx] = [
    'PATCH',
    `/api/notes/${id}`,
    'saving note position'
  ];

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pos_x, pos_y })
    });

    if (!res.ok) {
      logError(ctx, `${method} ${url} failed with status ${res.status}`);
      showToast('Could not save note position', true);
    }
  } catch (err) {
    logError(ctx, err);
    showToast('Could not reach the server', true);
  }
}

const getTopZ = (() => {
  let topZ = 0;
  return (() => ++topZ);
})();

function makeDraggable(noteEl) {
  let dragging = false;
  let startX, startY, startLeft, startTop;

  noteEl.addEventListener('mousedown', e => {
    // bring the note to foreground
    noteEl.style.zIndex = getTopZ();

    // for dragging, ignore any click inside the text area
    if (e.target.tagName === 'TEXTAREA') return;

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

    // add to note's original coordinates, distance the mouse has traveled
    noteEl.style.left = (startLeft + (clientX - startX)) + 'px';
    noteEl.style.top = (startTop + (clientY - startY)) + 'px';
  });

  document.addEventListener('mouseup', async e => {
    if (!dragging) return;
    dragging = false;

    const id = noteEl.dataset.id;
    const pos_x = parseInt(noteEl.style.left);
    const pos_y = parseInt(noteEl.style.top);

    await saveNotePosition(id, pos_x, pos_y);
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
    <div class="note-author">${author}</div>
    <textarea class="note-body" placeholder="Type something...">${text}</textarea>
  `;

  makeDraggable(noteEl);
  canvas.appendChild(noteEl);
}

function setupAddNoteBtn() {
  const addNoteBtn = document.getElementById('addNoteBtn');
  const [method, url, ctx] = ['POST', '/api/notes', 'adding note'];

  addNoteBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_id: boardId,
          pos_x: 80 + parseInt(Math.random() * 200),
          pos_y: 80 + parseInt(Math.random() * 200)
        })
      });

      if (!res.ok) {
        logError(ctx, `${method} ${url} failed with status ${res.status}`);
        showToast('Could not add note', true);
        return;
      }

      const note = await res.json();
      renderNote(note);
    } catch (err) {
      logError(ctx, err);
      showToast('Could not reach the server', true);
    }
  });
}

async function init() {
  const board = await loadBoard();
  if (!board) return;
  board.notes.forEach(note => renderNote(note));
  setupAddNoteBtn();
}

init();
