import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props { page: number; totalPages: number; total: number; onPage: (p: number) => void; }

export function Pagination({ page, totalPages, total, onPage }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
      <span>{total} records</span>
      <div className="flex items-center gap-1">
        <button disabled={page === 1} onClick={() => onPage(page - 1)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40">
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 font-medium">{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => onPage(page + 1)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
