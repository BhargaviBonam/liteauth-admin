export const TASK_STATUSES = [
  { key: 'backlog',     label: 'Backlog',     color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  { key: 'todo',        label: 'To Do',       color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  { key: 'in_review',   label: 'In Review',   color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  { key: 'done',        label: 'Done',        color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  { key: 'blocked',     label: 'Blocked',     color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
] as const;

export type TaskStatus = typeof TASK_STATUSES[number]['key'];

export function TaskStatusBadge({ status }: { status: string }) {
  const s = TASK_STATUSES.find(x => x.key === status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s?.color ?? 'bg-gray-100 text-gray-600'}`}>
      {s?.label ?? status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    high:   'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    low:    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[priority] ?? styles.low}`}>
      {priority}
    </span>
  );
}
