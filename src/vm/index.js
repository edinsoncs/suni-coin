import transfer from './instructions/transfer.js';
import stake from './instructions/stake.js';
import log from './instructions/log.js';
import emit from './instructions/emit.js';

const handlers = {
  TRANSFER: transfer,
  STAKE: stake,
  LOG: log,
  EMIT: emit,
  IF: doIf
};

export default function execute(script, state, debug = false) {
  if (typeof script !== 'string' && !Array.isArray(script)) {
    return { newState: state, events: [], status: 'error', error: 'Invalid script format' };
  }
  if (Array.isArray(script)) {
    try {
      script = serializeScript(script);
    } catch (e) {
      return { newState: state, events: [], status: 'error', error: e.message };
    }
  }
  const lines = script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length > 100) {
    return { newState: state, events: [], status: 'error', error: 'Instruction limit exceeded' };
  }
  const context = JSON.parse(JSON.stringify(state));
  const events = [];
  for (const line of lines) {
    if (debug) console.log('EXEC', line);
    const tokens = tokenizeLine(line);
    const res = executeTokens(tokens, context, events, debug);
    if (!res.ok) {
      return { newState: state, events, status: 'error', error: res.error };
    }
  }
  return { newState: context, events, status: 'success' };
}

function serializeScript(arr) {
  return arr.map(ins => serializeInstruction(ins)).join('\n');
}

function serializeInstruction(ins) {
  const op = ins.op.toUpperCase();
  switch (op) {
    case 'TRANSFER':
      return `TRANSFER ${ins.from} ${ins.to} ${ins.amount}`;
    case 'STAKE':
      return `STAKE ${ins.user} ${ins.amount}`;
    case 'LOG':
      return `LOG "${ins.message}"`;
    case 'EMIT':
      return `EMIT ${ins.event}`;
    case 'IF':
      return `IF ${ins.condition} THEN ${serializeInstruction(ins.then)}`;
    default:
      throw new Error(`Unknown op: ${op}`);
  }
}

function tokenizeLine(line) {
  return line.match(/"[^"]*"|\(|\)|\S+/g) || [];
}

function executeTokens(tokens, state, events, debug) {
  const op = tokens[0] ? tokens[0].toUpperCase() : '';
  const handler = handlers[op];
  if (!handler) {
    return { ok: false, error: `Unknown operation: ${op}` };
  }
  return handler(tokens, state, events, debug);
}

function doIf(tokens, state, events, debug) {
  const thenIndex = tokens.findIndex(t => t.toUpperCase() === 'THEN');
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
    if (debug) console.log('COND true');
    return executeTokens(actionTokens, state, events, debug);
  }
  if (debug) console.log('COND false');
  return { ok: true };
}

function evalCondition(tokens, state) {
  const { error, rpn } = toRPN(tokens);
  if (error) return { error };
  const stack = [];
  for (const tk of rpn) {
    if (typeof tk === 'string') {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(tk === 'AND' ? (a && b) : (a || b));
    } else {
      const res = evalComparison(tk.tokens, state);
      if (res.error) return { error: res.error };
      stack.push(res.value);
    }
  }
  return { value: stack.pop() || false };
}

function toRPN(tokens) {
  const parts = [];
  for (let i = 0; i < tokens.length;) {
    const tk = tokens[i].toUpperCase();
    if (tk === '(' || tk === ')') {
      parts.push(tk);
      i += 1;
    } else if (tk === 'AND' || tk === 'OR') {
      parts.push(tk);
      i += 1;
    } else if (tk === 'BALANCE') {
      if (i + 3 >= tokens.length) return { error: 'Malformed condition' };
      parts.push({ type: 'comp', tokens: tokens.slice(i, i + 4) });
      i += 4;
    } else {
      return { error: `Unsupported token: ${tokens[i]}` };
    }
  }
  const output = [];
  const stack = [];
  for (const p of parts) {
    if (typeof p === 'object') {
      output.push(p);
    } else if (p === 'AND' || p === 'OR') {
      const prec = p === 'AND' ? 2 : 1;
      while (stack.length && precedence(stack[stack.length - 1]) >= prec) {
        output.push(stack.pop());
      }
      stack.push(p);
    } else if (p === '(') {
      stack.push(p);
    } else if (p === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }
      if (!stack.length) return { error: 'Mismatched parentheses' };
      stack.pop();
    }
  }
  while (stack.length) {
    const op = stack.pop();
    if (op === '(') return { error: 'Mismatched parentheses' };
    output.push(op);
  }
  return { rpn: output };
}

function precedence(op) {
  return op === 'AND' ? 2 : 1;
}

function evalComparison(tokens, state) {
  if (tokens.length !== 4 || tokens[0].toUpperCase() !== 'BALANCE' || tokens[2] !== '>=') {
    return { error: 'Unsupported comparison' };
  }
  const user = tokens[1];
  const amount = Number(tokens[3]);
  if (!Number.isFinite(amount) || amount < 0) {
    return { error: 'Invalid amount' };
  }
  if (!(user in state.balances)) {
    return { error: `Unknown user: ${user}` };
  }
  return { value: (state.balances[user] || 0) >= amount };
}
