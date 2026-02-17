import { requestAPI } from './api.js';
import { showToast } from './utils.js';

function saveBoardToRecent({ id, name }) {
  const recent = JSON.parse(localStorage.getItem('recentBoards') || '[]');
  recent.unshift({ id, name, visitedAt: new Date().toISOString() });

  localStorage.setItem('recentBoards', JSON.stringify(recent.slice(0, 8)));
}

function registerFormSubmission() {
  const createForm = document.getElementById('createForm');
  createForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('boardName').value.trim();
    const template = document.getElementById('template').value;

    if (!name) {
      showToast('Please enter a board name', true);
      return;
    }

    const req = {
      method: 'POST',
      url: `/api/boards`,
      payload: { name, template },
      ctx: 'create board'
    };

    const [board, err] = await requestAPI(req);
    if (err !== null) return;

    saveBoardToRecent(board);
    window.location.href = `/board.html?id=${board.id}`;
  });
}

function renderRecentBoards() {
  const container = document.getElementById('recentBoards');
  const recent = JSON.parse(localStorage.getItem('recentBoards')) || [];
  if (recent.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = `
    <h2 class="heading">Recent boards</h2>
    <ul id="recentList">
      ${
    recent.map(board => `
        <li>
          <a href="/board.html?id=${board.id}">${board.name}</a>
          <span>${new Date(board.visitedAt).toLocaleDateString()}</span>
        </li>
      `).join('')
  }
    </ul>
  `;
}

function init() {
  registerFormSubmission();
  renderRecentBoards();
}

init();
