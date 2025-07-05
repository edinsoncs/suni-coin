export default function transfer(tokens, state, events) {
  if (tokens.length !== 4) {
    return { ok: false, error: 'Malformed TRANSFER' };
  }
  const [, from, to, amountStr] = tokens;
  if (!(from in state.balances)) {
    return { ok: false, error: `Unknown user: ${from}` };
  }
  if (!(to in state.balances)) {
    return { ok: false, error: `Unknown user: ${to}` };
  }
  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Invalid amount' };
  }
  if (state.balances[from] < amount) {
    return { ok: false, error: 'Insufficient funds' };
  }
  state.balances[from] -= amount;
  state.balances[to] += amount;
  events.push('transfer');
  return { ok: true };
}
