export default function execute(script, state) {
  const context = JSON.parse(JSON.stringify(state));
  const events = [];
  const lines = script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const res = executeLine(line, context, events);
    if (!res.ok) {
      return { newState: state, events, status: 'error', error: res.error };
    }
  }
  return { newState: context, events, status: 'success' };
}

function executeLine(line, state, events) {
  const tokens = line.split(/\s+/);
  const op = tokens[0].toUpperCase();
  switch (op) {
    case 'TRANSFER':
      return doTransfer(tokens, state, events);
    case 'STAKE':
      return doStake(tokens, state, events);
    case 'IF':
      return doIf(tokens, state, events);
    default:
      return { ok: false, error: `Unknown operation: ${op}` };
  }
}

function doTransfer(tokens, state, events) {
  if (tokens.length !== 4) {
    return { ok: false, error: 'Malformed TRANSFER' };
  }
  const [, from, to, amountStr] = tokens;
  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount < 0) {
    return { ok: false, error: 'Invalid amount' };
  }
  const fromBal = state.balances[from] || 0;
  if (fromBal < amount) {
    return { ok: false, error: 'Insufficient funds' };
  }
  state.balances[from] = fromBal - amount;
  state.balances[to] = (state.balances[to] || 0) + amount;
  events.push('transfer');
  return { ok: true };
}

function doStake(tokens, state, events) {
  if (tokens.length !== 3) {
    return { ok: false, error: 'Malformed STAKE' };
  }
  const [, user, amountStr] = tokens;
  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount < 0) {
    return { ok: false, error: 'Invalid amount' };
  }
  const bal = state.balances[user] || 0;
  if (bal < amount) {
    return { ok: false, error: 'Insufficient funds' };
  }
  state.balances[user] = bal - amount;
  state.stakes[user] = (state.stakes[user] || 0) + amount;
  events.push('stake');
  return { ok: true };
}

function doIf(tokens, state, events) {
  const thenIndex = tokens.indexOf('THEN');
  if (thenIndex === -1) {
    return { ok: false, error: 'Malformed IF' };
  }
  const condTokens = tokens.slice(1, thenIndex);
  const actionTokens = tokens.slice(thenIndex + 1);
  const condition = evalCondition(condTokens, state);
  if (condition.error) {
    return { ok: false, error: condition.error };
  }
  if (condition.value) {
    return executeLine(actionTokens.join(' '), state, events);
  }
  return { ok: true };
}

function evalCondition(tokens, state) {
  if (tokens.length === 4 && tokens[0].toUpperCase() === 'BALANCE' && tokens[2] === '>=') {
    const user = tokens[1];
    const amount = Number(tokens[3]);
    if (!Number.isFinite(amount) || amount < 0) {
      return { error: 'Invalid amount' };
    }
    return { value: (state.balances[user] || 0) >= amount };
  }
  return { error: 'Unsupported condition' };
}
