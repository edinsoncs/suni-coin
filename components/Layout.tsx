import Link from 'next/link';
import { ReactNode } from 'react';
import {
  FaHome,
  FaCubes,
  FaUser,
  FaDatabase,
  FaTools,
  FaChartLine,
} from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-gray-700 bg-background">
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
            <Link href="/analytics" className="hover:underline flex items-center gap-1">
              <FaChartLine /> Analytics
            </Link>
            <Link href="/admin" className="hover:underline flex items-center gap-1">
              <FaTools /> Admin
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
