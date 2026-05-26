import type { Task } from '../../types';
import { TaskStatusBadge, PriorityBadge } from './TaskStatusBadge';
import { formatDate } from '../../utils/formatters';
import { Edit, Trash2 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { can } from '../../utils/permissions';

interface Props { tasks: Task[]; onEdit: (t: Task) => void; onDelete: (t: Task) => void; }

export function TaskTable({ tasks, onEdit, onDelete }: Props) {
  const { user: me } = useAuthContext();
  if (tasks.length === 0) return <div className="text-center py-12 text-gray-400">No tasks found.</div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
          <tr>{['Title', 'Assignee', 'Status', 'Priority', 'Due Date', 'Actions'].map(h => (
            <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {tasks.map(t => (
            <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900 dark:text-white">{t.title}</p>
                {t.description && <p className="text-gray-400 text-xs truncate max-w-xs">{t.description}</p>}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.assignee_name || '—'}</td>
              <td className="px-4 py-3"><TaskStatusBadge status={t.status} /></td>
              <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(t.due_date)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {can(me, 'edit_task') && (
                    <button onClick={() => onEdit(t)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><Edit size={15} /></button>
                  )}
                  {can(me, 'delete_task') && (
                    <button onClick={() => onDelete(t)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"><Trash2 size={15} /></button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
