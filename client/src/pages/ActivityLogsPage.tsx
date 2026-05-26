import { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Pagination } from '../components/shared/Pagination';
import { activityService } from '../services/activityService';
import type { ActivityLog, PaginatedMeta } from '../types';
import { formatDateTime } from '../utils/formatters';
import { Activity } from 'lucide-react';

export function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    activityService.getLogs(page, 20).then(r => { setLogs(r.logs); setMeta(r.meta); });
  }, [page]);

  return (
    <PageWrapper title="Activity Logs">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {logs.length === 0 && <div className="text-center py-12 text-gray-400">No activity logs yet.</div>}
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-750">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity size={14} className="text-indigo-600 dark:text-indigo-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">{log.action}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span className="font-medium text-gray-600 dark:text-gray-300">{log.actor_name}</span>
                  <span>·</span>
                  <span>{formatDateTime(log.created_at)}</span>
                  {log.target_type && <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">{log.target_type}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPage={setPage} />
    </PageWrapper>
  );
}
