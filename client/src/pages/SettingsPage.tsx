import { PageWrapper } from '../components/layout/PageWrapper';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <PageWrapper title="Settings">
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Appearance</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your preferred color theme.</p>
            <div className="flex gap-3">
              <button onClick={() => theme === 'dark' && toggle()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${theme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                <Sun size={18} /> Light
              </button>
              <button onClick={() => theme === 'light' && toggle()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${theme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                <Moon size={18} /> Dark
              </button>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">About</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">LiteAuth Admin v1.0.0 — Lightweight User Management Dashboard</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
