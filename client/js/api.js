import { logError, showToast } from './utils.js';

export async function requestAPI({ method, url, payload, ctx }) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };

  try {
    if (payload !== undefined) {
      opts['body'] = JSON.stringify(payload);
    }

    const res = await fetch(url, opts);

    if (!res.ok) {
      logError(ctx, `${method} ${url} failed with status ${res.status}`);
      showToast(`Could not ${ctx}`, true);
    }

    const resContentType = res.headers.get('Content-Type');

    // Where we aren't returning any data eg DELETE a note
    const result = resContentType?.includes('application/json')
      ? await res.json()
      : null;

    return [result, null];
  } catch (err) {
    logError(ctx, err);
    showToast('Could not reach the server', true);
    return [null, err];
  }
}
