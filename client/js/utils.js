export function showToast(msg, isError = false) {
  Toastify({
    text: msg,
    duration: 3000,
    gravity: 'top',
    position: 'center',
    style: {
      background: isError ? '#c0392b' : '#2c2c2c',
      fontSize: '0.85rem',
      borderRadius: '5px'
    }
  }).showToast();
}

export function logError(ctx, err) {
  console.error(`[${ctx}]`, err);
}
