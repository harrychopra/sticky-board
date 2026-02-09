const createForm = document.getElementById('createForm');

createForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('boardName').value.trim();
  if (!name) return;

  const template = document.getElementById('template').value;

  const res = await fetch('/api/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, template })
  });

  if (!res.ok) {
    console.error(res.status);
    return;
  }
  const board = await res.json();
  window.location.href = `/board.html?id=${board.id}`;
});
