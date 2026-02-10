const params = new URLSearchParams(window.location.search);
const boardId = params.get('id');
if (!boardId) window.location.href = '/';

const boardTitle = document.getElementById('boardTitle');
const canvas = document.getElementById('boardCanvas');

async function loadBoard() {
  const res = await fetch(`/api/boards/${boardId}`);
  if (!res.ok) {
    boardTitle.textContent = 'Board not found';
    return null;
  }

  const board = await res.json();
  boardTitle.textContent = board.name;
  document.title = `${board.name} - StickyBoard`;
  return board;
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

  addNoteBtn.addEventListener('click', async () => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board_id: boardId,
        pos_x: 80 + parseInt(Math.random() * 200),
        pos_y: 80 + parseInt(Math.random() * 200)
      })
    });

    if (!res.ok) {
      console.error('POST /api/notes, status:', res.status);
      return;
    }

    const note = await res.json();
    renderNote(note);
  });
}

async function init() {
  const board = await loadBoard();
  if (!board) return;
  setupAddNoteBtn();
}

init();
