import execute from '../src/vm/index.js';

describe('BYDLang VM', () => {
  test('runs transfer and stake', () => {
    const script = `
TRANSFER alice bob 100
STAKE bob 50
`;
    const state = {
      balances: { alice: 200, bob: 50 },
      stakes: { bob: 0 }
    };
    const result = execute(script, state);
    expect(result).toEqual({
      newState: {
        balances: { alice: 100, bob: 150 },
        stakes: { bob: 50 }
      },
      events: ['transfer', 'stake'],
      status: 'success'
    });
  });

  test('conditional transfer executes when true', () => {
    const script = 'IF BALANCE alice >= 100 THEN TRANSFER alice bob 50';
    const state = { balances: { alice: 120, bob: 0 }, stakes: {} };
    const result = execute(script, state);
    expect(result.newState.balances.bob).toBe(50);
    expect(result.status).toBe('success');
  });

  test('conditional transfer skipped when false', () => {
    const script = 'IF BALANCE alice >= 200 THEN TRANSFER alice bob 50';
    const state = { balances: { alice: 120, bob: 0 }, stakes: {} };
    const result = execute(script, state);
    expect(result.newState.balances.bob).toBe(0);
    expect(result.status).toBe('success');
  });

  test('handles complex conditions', () => {
    const script = 'IF BALANCE alice >= 100 AND ( BALANCE bob >= 50 OR BALANCE carl >= 30 ) THEN TRANSFER alice bob 20';
    const state = { balances: { alice: 150, bob: 60, carl: 0 }, stakes: {} };
    const result = execute(script, state);
    expect(result.newState.balances.bob).toBe(80);
  });

  test('logs and emits events', () => {
    const script = `
LOG "hello"
EMIT payout
`;
    const state = { balances: { a: 1 }, stakes: {} };
    const result = execute(script, state);
    expect(result.events).toEqual(['log:hello', 'payout']);
  });

  test('json script executes', () => {
    const script = [
      { op: 'TRANSFER', from: 'alice', to: 'bob', amount: 10 },
      { op: 'LOG', message: 'done' }
    ];
    const state = { balances: { alice: 20, bob: 0 }, stakes: {} };
    const result = execute(script, state);
    expect(result.newState.balances.bob).toBe(10);
    expect(result.events).toEqual(['transfer', 'log:done']);
  });

  test('fails when instruction limit exceeded', () => {
    const lines = Array.from({ length: 101 }, () => 'EMIT e').join('\n');
    const state = { balances: {}, stakes: {} };
    const result = execute(lines, state);
    expect(result.status).toBe('error');
  });
});
