const API = 'http://localhost:8000';

async function mineIfPending() {
  try {
    const memRes = await fetch(`${API}/api/mempool`);
    const mem = await memRes.json();
    if (Array.isArray(mem) && mem.length > 0) {
      await fetch(`${API}/api/mine/transactions`);
      console.log(`Mined ${mem.length} transaction(s)`);
    }
  } catch (err) {
    console.error('Auto mining failed:', err.message);
  }
}

setInterval(mineIfPending, 5000);
console.log('Auto miner running...');
