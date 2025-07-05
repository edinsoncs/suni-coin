export default function stake(tokens, state, events) {
  if (tokens.length !== 3) {
    return { ok: false, error: 'Malformed STAKE' };
  }
  const [, user, amountStr] = tokens;
  if (!(user in state.balances)) {
    return { ok: false, error: `Unknown user: ${user}` };
  }
  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Invalid amount' };
  }
  if (state.balances[user] < amount) {
    return { ok: false, error: 'Insufficient funds' };
  }
  state.balances[user] -= amount;
  state.stakes[user] = (state.stakes[user] || 0) + amount;
  events.push('stake');
  return { ok: true };
}
