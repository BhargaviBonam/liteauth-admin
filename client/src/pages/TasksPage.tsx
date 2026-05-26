import { useEffect, useState, useCallback } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TaskTable } from '../components/tasks/TaskTable';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskForm } from '../components/tasks/TaskForm';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { Pagination } from '../components/shared/Pagination';
import { taskService } from '../services/taskService';
import type { Task, PaginatedMeta } from '../types';
import { useAuthContext } from '../context/AuthContext';
import { can } from '../utils/permissions';
import { notifyStatsChanged } from '../hooks/useStats';
import { Plus, LayoutGrid, List } from 'lucide-react';

type ViewMode = 'kanban' | 'list';

export function TasksPage() {
  const { user: me } = useAuthContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState<ViewMode>('kanban');
  const [editing, setEditing] = useState<Task | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const load = useCallback(async () => {
    const r = await taskService.list({ page, limit: 10, status: statusFilter, priority: priorityFilter });
    setTasks(r.tasks);
    setMeta(r.meta);
  }, [page, statusFilter, priorityFilter]);

  const loadAll = useCallback(async () => {
    const r = await taskService.list({ page: 1, limit: 200 });
    setAllTasks(r.tasks);
  }, []);

  useEffect(() => { load(); loadAll(); }, [load, loadAll]);

  interface TaskFormData { title: string; description: string; priority: string; due_date: string; assigned_to: string; status: string; }

  const handleSave = async (data: TaskFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      priority: data.priority as 'low' | 'medium' | 'high',
      due_date: data.due_date || undefined,
      assigned_to: data.assigned_to ? parseInt(data.assigned_to) : undefined,
      status: data.status as Task['status'],
    };
    if (editing) { await taskService.update(editing.id, payload); }
    else { await taskService.create(payload); }
    setEditing(undefined);
    load(); loadAll(); notifyStatsChanged();
  };

  const handleDelete = async () => {
    if (deleting) { await taskService.remove(deleting.id); setDeleting(null); load(); loadAll(); notifyStatsChanged(); }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    await taskService.update(taskId, { status: newStatus as Task['status'] });
    load(); loadAll(); notifyStatsChanged();
  };

  return (
    <PageWrapper title="Task Board">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${view === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <LayoutGrid size={15} /> Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <List size={15} /> List
            </button>
          </div>

          {/* Filters (list view only) */}
          {view === 'list' && (
            <>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm py-2 w-36">
                <option value="">All Status</option>
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
              <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }} className="input-field text-sm py-2 w-32">
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </>
          )}

          {can(me, 'create_task') && (
            <button onClick={() => setEditing(null)}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
              <Plus size={16} /> New Task
            </button>
          )}
        </div>

        {/* Kanban summary stats */}
        {view === 'kanban' && (
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
            {['backlog','todo','in_progress','in_review','done','blocked'].map(s => {
              const count = allTasks.filter(t => t.status === s).length;
              return count > 0 ? <span key={s} className="font-medium capitalize">{s.replace('_',' ')}: <span className="text-gray-800 dark:text-gray-200">{count}</span></span> : null;
            })}
            <span className="ml-auto">Total: <span className="font-medium text-gray-800 dark:text-gray-200">{allTasks.length}</span></span>
          </div>
        )}

        {/* Board or List view */}
        {view === 'kanban' ? (
          <KanbanBoard
            tasks={allTasks}
            onEdit={setEditing}
            onDelete={setDeleting}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <>
            <TaskTable tasks={tasks} onEdit={setEditing} onDelete={setDeleting} />
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPage={setPage} />
          </>
        )}
      </div>

      {editing !== undefined && (
        <TaskForm task={editing} onSave={handleSave} onClose={() => setEditing(undefined)} />
      )}
      <ConfirmDialog
        open={!!deleting}
        title="Delete Task"
        message={`Delete task "${deleting?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </PageWrapper>
  );
}
