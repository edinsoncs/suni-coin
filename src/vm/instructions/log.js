export default function log(tokens, state, events, debug, logs) {
  if (tokens.length < 2) {
    return { ok: false, error: 'Malformed LOG' };
  }
  const msg = tokens.slice(1).join(' ').replace(/^"|"$/g, '');
  events.push(`log:${msg}`);
  if (debug) logs.push(`log ${msg}`);
  return { ok: true };
}
