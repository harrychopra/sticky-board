import { logError, showToast } from './utils.js';

export async function requestAPI({ method, url, payload, ctx }) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };

  try {
    if (payload !== undefined) {
      opts.body = JSON.stringify(payload);
    }

    const res = await fetch(url, opts);

    // requests like DELETE often wont return data
    const contentType = res.headers.get('Content-Type');
    const result = contentType?.includes('application/json')
      ? await res.json()
      : null;

    if (!res.ok) {
      const message =
        `${ctx} ${method} ${url} failed with status ${res.status}`;
      logError(message, result);
      showToast(`Could not ${ctx}`, true);

      return [null, new Error()];
    }

    return [result, null];
  } catch (err) {
    logError(ctx, err);
    showToast('Could not reach the server', true);
    return [null, err];
  }
}
