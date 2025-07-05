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
});
