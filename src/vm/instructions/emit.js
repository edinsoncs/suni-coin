export default function emit(tokens, state, events) {
  if (tokens.length !== 2) {
    return { ok: false, error: 'Malformed EMIT' };
  }
  const [, name] = tokens;
  events.push(name);
  return { ok: true };
}
