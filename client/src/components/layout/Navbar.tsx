import { Sun, Moon } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../shared/Avatar';
import { roleLabel } from '../../utils/formatters';

export function Navbar({ title }: { title: string }) {
  const { user } = useAuthContext();
  const { theme, toggle } = useTheme();
  return (
    <header className="h-16 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <Avatar name={user.name} avatar={user.avatar} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{roleLabel(user.role)}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
