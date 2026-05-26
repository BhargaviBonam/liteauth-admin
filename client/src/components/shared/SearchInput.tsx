import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props { value: string; onChange: (v: string) => void; placeholder?: string; }

export function SearchInput({ value, onChange, placeholder = 'Search…' }: Props) {
  const [local, setLocal] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => onChange(local), 350);
    return () => clearTimeout(t);
  }, [local, onChange]);
  useEffect(() => { setLocal(value); }, [value]);
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input value={local} onChange={e => setLocal(e.target.value)} placeholder={placeholder}
        className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full" />
    </div>
  );
}
