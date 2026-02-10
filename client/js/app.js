import { logError, showToast } from './utils.js';

const createForm = document.getElementById('createForm');

createForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('boardName').value.trim();
  const template = document.getElementById('template').value;

  if (!name) {
    showToast('Please enter a board name', true);
    return;
  }

  const [method, url, ctx] = ['POST', `/api/boards`, 'creating board'];

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, template })
    });

    if (!res.ok) {
      logError(ctx, `${method} ${url} failed with status ${res.status}`);
      showToast('Could not create board', true);
      return;
    }

    const board = await res.json();
    window.location.href = `/board.html?id=${board.id}`;
  } catch (err) {
    logError(ctx, err);
    showToast('Could not reach the server', true);
  }
});
