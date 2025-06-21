import Link from 'next/link';
import { FaHome, FaCubes, FaUser, FaDatabase, FaTools } from 'react-icons/fa';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 text-white">
        <nav className="max-w-5xl mx-auto flex justify-between items-center p-4">
          <Link href="/" className="font-semibold hover:underline flex items-center gap-1">
            <FaHome /> Home
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/blocks" className="hover:underline flex items-center gap-1">
              <FaCubes /> Blocks
            </Link>
            <Link href="/metadata" className="hover:underline flex items-center gap-1">
              <FaDatabase /> Metadata
            </Link>
            <Link href="/profile" className="hover:underline flex items-center gap-1">
              <FaUser /> Profile
            </Link>
            <Link href="/admin" className="hover:underline flex items-center gap-1">
              <FaTools /> Admin
            </Link>
          </div>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
