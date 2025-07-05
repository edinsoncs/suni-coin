import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Ajv from 'ajv'
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ThemeContext'

const Monaco = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const KEYWORDS = [
  'TRANSFER',
  'STAKE',
  'LOG',
  'EMIT',
  'IF',
  'THEN',
  'BALANCE',
  'AND',
  'OR',
  'LOOP',
  'ASSERT',
  'state.get',
  'state.set'
]

const baseSnippets = [
  {
    label: 'Base contract',
    insertText: 'TRANSFER alice bob 10\nSTAKE alice 10',
    kind: 15
  },
  {
    label: 'Conditional',
    insertText: 'IF BALANCE alice >= 10 THEN TRANSFER alice bob 5',
    kind: 15
  },
  {
    label: 'Loop',
    insertText: 'EMIT loopStart\n',
    kind: 15
  }
]

export default function VmPlayground() {
  const { theme } = useTheme()
  const [script, setScript] = useState('')
  const [stateText, setStateText] = useState('{}')
  const [stateErr, setStateErr] = useState<string | null>(null)
  const [debug, setDebug] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [history, setHistory] = useState<{ script: string; state: string }[]>([])
  const [templates, setTemplates] = useState<{ [k: string]: string }>({})
  const [showTree, setShowTree] = useState(false)
  const [blockInfo, setBlockInfo] = useState<{ height: number; avg: number }>({ height: 0, avg: 0 })
  const ajv = new Ajv()

  const handleMount = (_: any, monaco: any) => {
    monaco.languages.register({ id: 'bydlang' })
    monaco.languages.setMonarchTokensProvider('bydlang', {
      tokenizer: {
        root: [
          [new RegExp(`\\b(?:${KEYWORDS.map(k => k.replace('.', '\\.')).join('|')})\\b`), 'keyword'],
          [/".*?"/, 'string'],
          [/[0-9]+/, 'number'],
          [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier']
        ]
      }
    })

    const keywordSuggestions = KEYWORDS.map(k => ({
      label: k.toLowerCase(),
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: k
    }))

    const snippetSuggestions = [
      {
        label: 'state.get',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'state.get("${1:key}")',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'state.set',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'state.set("${1:key}", ${2:value})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'if',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'IF ${1:COND} THEN ${2:ACTION}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'loop',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'LOOP ${1:times}\\n  ${2:ACTIONS}\\nEND',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      }
    ]

    monaco.languages.registerCompletionItemProvider('bydlang', {
      provideCompletionItems: () => ({
        suggestions: [...baseSnippets, ...snippetSuggestions, ...keywordSuggestions]
      })
    })

    monaco.languages.registerHoverProvider('bydlang', {
      provideHover(model, position) {
        const word = model.getWordAtPosition(position)
        if (!word) return null
        if (word.word === 'state.get') {
          return {
            contents: [
              { value: '**state.get(key)**\\n\\nReturns the value of a key from the current state.\\nUsage: `let x = state.get("key")`' }
            ]
          }
        }
        if (word.word === 'assert') {
          return {
            contents: [
              { value: '**assert(condition)**\\n\\nThrows an error if condition is false.\\nUsage: `assert(balance >= 10)`' }
            ]
          }
        }
        return null
      }
    })
  }

  useEffect(() => {
    try {
      const data = JSON.parse(stateText)
      ajv.validateSchema(data)
      setStateErr(null)
    } catch (e: any) {
      setStateErr(e.message)
    }
  }, [stateText])

  useEffect(() => {
    const saved = localStorage.getItem('templates')
    if (saved) setTemplates(JSON.parse(saved))
  }, [])

  const handleRun = async () => {
    setResult(null)
    setLogs([])
    try {
      const res = await fetch('/api/run-vm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, state: JSON.parse(stateText), debug })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setResult(data)
      if (Array.isArray(data.logs)) setLogs(data.logs)
      setHistory(h => [{ script, state: stateText }, ...h].slice(0, 5))
    } catch (e: any) {
      setLogs(l => [...l, `Error: ${e.message}`])
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [script, stateText, debug])

  async function loadStateFromBlock() {
    try {
      const res = await fetch('http://localhost:8000/api/blocks')
      const blocks = await res.json()
      if (blocks.length) {
        const last = blocks[blocks.length - 1]
        if (last.state) setStateText(JSON.stringify(last.state, null, 2))
        else if (last.data) setStateText(JSON.stringify(last.data, null, 2))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const saveTemplate = () => {
    const name = prompt('Template name')
    if (!name) return
    const next = { ...templates, [name]: script }
    setTemplates(next)
    localStorage.setItem('templates', JSON.stringify(next))
  }

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('http://localhost:8000/api/metrics/extended')
        const m = await res.json()
        setBlockInfo({ height: m.chainLength, avg: m.avgBlockTime })
      } catch (e) {}
    }
    fetchMetrics()
    const id = setInterval(fetchMetrics, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className='py-10 space-y-4'>
      <h1 className='text-2xl font-semibold'>BYDLang VM Playground</h1>
      <div className='text-sm'>Height: {blockInfo.height} | Avg Block Time: {blockInfo.avg.toFixed(2)}ms</div>
      <div className='space-y-2 text-sm text-neutral-300'>
        <p>This playground lets you run BYDLang scripts against a JSON state.</p>
        <p><strong>Creating tokens:</strong> each wallet receives an initial balance and you can move tokens with the <code>TRANSFER</code> instruction or through the wallet page.</p>
        <p><strong>Creating NFTs:</strong> store a unique entry in the state using <code>state.set('nft.&lt;id&gt;.owner', '&lt;address&gt;')</code>. Update this value when the NFT changes hands.</p>
        <p>You can also stake tokens with <code>STAKE</code>, emit events with <code>EMIT</code> and add conditions using <code>IF</code>.</p>
      </div>
      <div>
        <Monaco
          language='bydlang'
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={script}
          onChange={value => setScript(value || '')}
          onMount={handleMount}
          height={200}
        />
      </div>
      <div>
        <label className='block mb-1'>Initial state (JSON)</label>
        <textarea
          className='w-full h-32 bg-black text-white p-2 font-mono'
          value={stateText}
          onChange={e => setStateText(e.target.value)}
        />
        {stateErr && <div className='text-red-500'>{stateErr}</div>}
      </div>
      <div className='flex gap-2 items-center'>
        <input type='checkbox' id='dbg' checked={debug} onChange={e => setDebug(e.target.checked)} />
        <label htmlFor='dbg'>Debug</label>
      </div>
      <div className='flex gap-2 flex-wrap'>
        <Button onClick={handleRun}>Run</Button>
        <Button onClick={saveTemplate} variant='outline'>Save as template</Button>
        <Button onClick={loadStateFromBlock} variant='outline'>Load current state</Button>
        <Button onClick={() => setShowTree(s => !s)} variant='outline'>View state</Button>
      </div>
      {Object.keys(templates).length > 0 && (
        <select onChange={e => setScript(templates[e.target.value])} className='bg-black text-white p-1'>
          <option value=''>Load template...</option>
          {Object.entries(templates).map(([k]) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      )}
      {history.length > 0 && (
        <select onChange={e => {
          const h = history[Number(e.target.value)]
          if (h) { setScript(h.script); setStateText(h.state) }
        }} className='bg-black text-white p-1'>
          <option value=''>History...</option>
          {history.map((h, i) => (
            <option key={i} value={i}>{new Date().toLocaleTimeString()}</option>
          ))}
        </select>
      )}
      {logs.length > 0 && (
        <pre className='bg-black text-green-400 p-2 whitespace-pre-wrap'>{logs.join('\n')}</pre>
      )}
      {showTree && result && (
        <ReactJson src={result.newState} theme={theme === 'dark' ? 'monokai' : 'rjv-default'} />
      )}
    </div>
  )
}
