import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function TransactionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/api/transaction/${id}`)
      .then(res => res.json())
      .then(data => {
        setInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!info) return <p>Transaction not found</p>;

  return (
    <div className="max-w-xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4 break-all">Transaction {id}</h1>
      <pre className="bg-gray-900 p-4 rounded overflow-auto">
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  );
}
