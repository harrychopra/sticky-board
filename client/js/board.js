const params = new URLSearchParams(window.location.search);
const boardId = params.get('id');
console.log('boardId', boardId);

if (!boardId) window.location.href = '/';

const boardTitle = document.getElementById('boardTitle');

async function init() {
  const res = await fetch(`/api/boards/${boardId}`);
  if (!res.ok) {
    boardTitle.textContent = 'Board not found';
    return;
  }

  const board = await res.json();
  boardTitle.textContent = board.name;
  document.title = `${boardName} - StickyBoard`;
}

init();
