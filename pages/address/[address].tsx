import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function AddressPage() {
  const router = useRouter();
  const { address } = router.query;
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!address) return;
    fetch(`${API_BASE}/api/balance/${address}`).then(res => res.json()).then(setBalance);
    fetch(`${API_BASE}/api/address/${address}/transactions`).then(res => res.json()).then(setTransactions);
  }, [address]);

  if (!address) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold break-all mb-4">Address {address}</h1>
      {balance && (
        <div className="bg-gray-900 p-4 rounded mb-4">
          <p>Balance: {balance.balance}</p>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-2">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-black border border-gray-700">
            <tr>
              <th className="px-2 py-1">Block</th>
              <th className="px-2 py-1">Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="px-2 py-1">{t.blockIndex}</td>
                <td className="px-2 py-1">
                  <pre className="whitespace-pre-wrap break-all bg-gray-900 p-2 rounded">{JSON.stringify(t.transaction, null, 2)}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
