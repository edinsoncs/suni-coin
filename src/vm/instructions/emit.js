export default function emit(tokens, state, events, debug, logs) {
  if (tokens.length !== 2) {
    return { ok: false, error: 'Malformed EMIT' };
  }
  const [, name] = tokens;
  events.push(name);
  if (debug) logs.push(`emit ${name}`);
  return { ok: true };
}
