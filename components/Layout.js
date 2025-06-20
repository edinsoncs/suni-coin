import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white">
        <nav className="max-w-5xl mx-auto flex justify-between items-center p-4">
          <Link href="/" className="font-semibold hover:underline">BYDChain Explorer</Link>
          <div className="space-x-4">
            <Link href="/blocks" className="hover:underline">Blocks</Link>
          </div>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
