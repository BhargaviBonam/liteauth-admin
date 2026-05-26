import { PageWrapper } from '../components/layout/PageWrapper';
import { StatCard } from '../components/dashboard/StatCard';
import { RegistrationChart } from '../components/dashboard/RegistrationChart';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { useStats } from '../hooks/useStats';
import { Users, UserCheck, CheckSquare, Layers, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const STATUS_CONFIG = [
  { key: 'backlog',     label: 'Backlog',     color: 'bg-gray-400',   text: 'text-gray-600 dark:text-gray-300' },
  { key: 'todo',        label: 'To Do',       color: 'bg-blue-400',   text: 'text-blue-600 dark:text-blue-300' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-yellow-400', text: 'text-yellow-600 dark:text-yellow-300' },
  { key: 'in_review',   label: 'In Review',   color: 'bg-purple-400', text: 'text-purple-600 dark:text-purple-300' },
  { key: 'done',        label: 'Done',        color: 'bg-green-400',  text: 'text-green-600 dark:text-green-300' },
  { key: 'blocked',     label: 'Blocked',     color: 'bg-red-400',    text: 'text-red-600 dark:text-red-300' },
] as const;

export function DashboardPage() {
  const { stats, loading, lastUpdated, refresh } = useStats(15000);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <PageWrapper title="Dashboard">
      {/* Live indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Live · refreshes every 15 s
          {lastUpdated && <span className="ml-1">· last at {formatTime(lastUpdated)}</span>}
        </div>
        <button onClick={refresh} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          <RefreshCw size={12} /> Refresh now
        </button>
      </div>

      {loading && !stats ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Loading…</div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Top stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users"  value={stats.totalUsers}  icon={Users}       color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/30" />
            <StatCard label="Active Users" value={stats.activeUsers} icon={UserCheck}   color="text-green-600"  bg="bg-green-50 dark:bg-green-900/30" />
            <StatCard label="Total Tasks"  value={stats.totalTasks}  icon={CheckSquare} color="text-blue-600"   bg="bg-blue-50 dark:bg-blue-900/30" />
            <StatCard label="Blocked"      value={stats.tasksByStatus.blocked} icon={AlertCircle} color="text-red-600" bg="bg-red-50 dark:bg-red-900/30" />
          </div>

          {/* Task status breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers size={16} className="text-indigo-500" /> Task Status Breakdown
              </h3>
              <span className="text-xs text-gray-400">{stats.totalTasks} total</span>
            </div>

            {/* Progress bar */}
            {stats.totalTasks > 0 && (
              <div className="flex rounded-full overflow-hidden h-3 mb-5 gap-0.5">
                {STATUS_CONFIG.map(({ key, color }) => {
                  const val = stats.tasksByStatus[key];
                  const pct = (val / stats.totalTasks) * 100;
                  return pct > 0 ? (
                    <div key={key} title={`${key}: ${val}`} style={{ width: `${pct}%` }}
                      className={`${color} transition-all duration-500 first:rounded-l-full last:rounded-r-full`} />
                  ) : null;
                })}
              </div>
            )}

            {/* Status grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {STATUS_CONFIG.map(({ key, label, color, text }) => {
                const val = stats.tasksByStatus[key];
                return (
                  <div key={key} className="text-center">
                    <div className={`text-2xl font-bold ${text}`}>{val}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock size={18} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.tasksByStatus.in_progress}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                <RefreshCw size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.tasksByStatus.in_review}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">In Review</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.tasksByStatus.done}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Done</p>
              </div>
            </div>
          </div>

          {/* Charts + Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <RegistrationChart data={stats.registrationTrend} />
            <ActivityTimeline logs={stats.recentLogs} />
          </div>
        </div>
      ) : null}
    </PageWrapper>
  );
}
