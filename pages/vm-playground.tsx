import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function VmPlayground() {
  const [script, setScript] = useState('')
  const [state, setState] = useState('{}')
  const [debug, setDebug] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const handleRun = async () => {
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/run-vm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, state: JSON.parse(state), debug })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    }
  }
  return (
    <div className='bg-neutral-950 min-h-screen py-10 text-white'>
      <div className='max-w-3xl mx-auto space-y-6'>
        <h1 className='text-2xl font-semibold'>BYDLang VM Playground</h1>
        <div>
          <label className='block mb-1'>Script BYDLang</label>
          <textarea
            className='w-full h-40 bg-black border border-white/20 rounded-lg p-2 font-mono'
            value={script}
            onChange={e => setScript(e.target.value)}
          />
        </div>
        <div>
          <label className='block mb-1'>Estado inicial (JSON)</label>
          <textarea
            className='w-full h-32 bg-black border border-white/20 rounded-lg p-2 font-mono'
            value={state}
            onChange={e => setState(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-2'>
          <input type='checkbox' id='dbg' checked={debug} onChange={e => setDebug(e.target.checked)} />
          <label htmlFor='dbg'>Debug</label>
        </div>
        <Button onClick={handleRun}>Ejecutar</Button>
        {error && <div className='text-red-500'>{error}</div>}
        {result && (
          <pre className='bg-black text-white p-4 rounded-lg whitespace-pre-wrap break-all'>
{JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
