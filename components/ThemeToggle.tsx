import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function toggle() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 border rounded text-xs hover:bg-gray-700"
    >
      {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
}
