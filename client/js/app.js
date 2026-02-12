import { requestAPI } from './api.js';
import { showToast } from './utils.js';

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

  window.location.href = `/board.html?id=${board.id}`;
});
