import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

  if (loading) return <p>Loading...</p>
  if (!info) return <p>Transaction not found</p>

  const { status, blockIndex, transaction } = info as any
  const date = new Date(transaction.input.timestamp).toLocaleString()

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold break-all">Transaction {transaction.id}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Status
            <Badge variant={status === 'confirmed' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {typeof blockIndex === 'number' && (
            <div>Block Index: {blockIndex}</div>
          )}
          <div>Date: {date}</div>
          <div>From: <span className="font-mono break-all">{transaction.input.address}</span></div>
          <div className="space-y-1">
            <div className="font-medium">Outputs:</div>
            <ul className="pl-4 list-disc space-y-1">
              {transaction.outputs.map((o: any, i: number) => (
                <li key={i} className="break-all">
                  <span className="font-mono">{o.address}</span> - {o.amount}
                </li>
              ))}
            </ul>
          </div>
          {transaction.script && (
            <div>
              <div className="font-medium">Script:</div>
              <pre className="bg-gray-900 p-2 rounded overflow-auto text-xs mt-1">
                {transaction.script}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
