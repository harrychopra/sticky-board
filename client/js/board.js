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

function renderNote(note) {
  const el = document.createElement('div');
  el.className = 'note';
  el.dataset.id = note.id;
  el.style.left = note.pos_x + 'px';
  el.style.top = note.pos_y + 'px';
  el.style.backgroundColor = note.colour;

  el.innerHTML = `
    <div class="note-author">${note.author}</div>
    <textarea class="note-body" placeholder="Type something...">${note.text}</textarea>
  `;

  canvas.appendChild(el);
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
