import type { ActivityLog } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { Activity } from 'lucide-react';

export function ActivityTimeline({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      {logs.length === 0 && <p className="text-sm text-gray-400">No activity yet.</p>}
      <div className="space-y-3">
        {logs.map(log => (
          <div key={log.id} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Activity size={12} className="text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white truncate">{log.action}</p>
              <p className="text-xs text-gray-400">{log.actor_name} · {formatDateTime(log.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
