import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import { Input } from './ui/input'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [touched, setTouched] = useState(false)
  const router = useRouter()

  const handleSearch = async (q: string) => {
    setQuery(q)
    setTouched(true)
    if (q.length > 1) {
      try {
        const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(q)}`)
        if (res.ok) {
          const json = await res.json()
          setResults(json)
        } else {
          setResults([])
        }
      } catch (e) {
        console.error(e)
        setResults([])
      }
    } else {
      setResults([])
    }
  }

  const handleSelect = (r: any) => {
    setResults([])
    setQuery('')
    if (r.type === 'block') {
      router.push(`/blocks/${r.hash}`)
    } else if (r.type === 'transaction') {
      router.push(`/tx/${r.id}`)
    } else if (r.type === 'address') {
      router.push(`/address/${r.address}`)
    }
  }

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search blocks, transactions, addresses..."
        className="pl-10 bg-black text-white placeholder-gray-400"
      />
      {(results.length > 0 || (touched && query && results.length === 0)) && (
        <div className="absolute z-10 w-full bg-black text-white border border-gray-700 mt-1 rounded max-h-60 overflow-auto">
          {results.length > 0 ? (
            results.map((r, i) => (
              <div
                key={i}
                className="p-2 cursor-pointer hover:bg-gray-700 text-sm"
                onClick={() => handleSelect(r)}
              >
                <div className="flex justify-between">
                  <span className="truncate mr-2">{r.hash || r.id || r.address}</span>
                  <span className="text-xs text-gray-400 uppercase">{r.type}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-400">No existe</div>
          )}
        </div>
      )}
    </div>
  )
}
