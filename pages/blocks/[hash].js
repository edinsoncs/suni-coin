import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function BlockDetail() {
  const router = useRouter();
  const { hash } = router.query;
  const [block, setBlock] = useState(null);

  useEffect(() => {
    if (hash) {
      fetch(`${API_BASE}/api/block/${hash}`)
        .then(res => res.json())
        .then(setBlock);
    }
  }, [hash]);

  if (!block) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 break-all">Block {hash}</h1>
      <pre className="bg-gray-900 p-4 overflow-auto rounded">
        {JSON.stringify(block, null, 2)}
      </pre>
    </div>
  );
}
