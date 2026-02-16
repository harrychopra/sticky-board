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

const adjectives = [
  'quick',
  'lazy',
  'happy',
  'clever',
  'brave',
  'calm',
  'eager',
  'fierce',
  'gentle',
  'jolly'
];

const animals = [
  'panda',
  'falcon',
  'otter',
  'badger',
  'fox',
  'wolf',
  'lynx',
  'crane',
  'bison',
  'gecko'
];

export function generateUsername() {
  const random = upto => Math.floor(Math.random() * upto);

  const adj = adjectives[random(adjectives.length)];
  const animal = animals[random(animals.length)];
  const num = random(100);

  return `${adj}-${animal}-${num}`;
}
