import { useState } from 'react';
import type { Task } from '../../types';
import { TASK_STATUSES } from './TaskStatusBadge';
import { PriorityBadge } from './TaskStatusBadge';
import { formatDate } from '../../utils/formatters';
import { Edit, Trash2, User, Calendar, GripVertical } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { can } from '../../utils/permissions';

interface Props {
  tasks: Task[];
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
  onStatusChange: (taskId: number, newStatus: string) => void;
}

const COLUMN_HEADER_COLORS: Record<string, string> = {
  backlog:     'border-gray-400 dark:border-gray-500',
  todo:        'border-blue-400 dark:border-blue-500',
  in_progress: 'border-yellow-400 dark:border-yellow-500',
  in_review:   'border-purple-400 dark:border-purple-500',
  done:        'border-green-400 dark:border-green-500',
  blocked:     'border-red-400 dark:border-red-500',
};

const COLUMN_BG: Record<string, string> = {
  backlog:     'bg-gray-50 dark:bg-gray-800/50',
  todo:        'bg-blue-50/50 dark:bg-blue-950/30',
  in_progress: 'bg-yellow-50/50 dark:bg-yellow-950/30',
  in_review:   'bg-purple-50/50 dark:bg-purple-950/30',
  done:        'bg-green-50/50 dark:bg-green-950/30',
  blocked:     'bg-red-50/50 dark:bg-red-950/30',
};

function TaskCard({ task, onEdit, onDelete, onStatusChange, canEdit, canDelete }: {
  task: Task; onEdit: () => void; onDelete: () => void;
  onStatusChange: (status: string) => void; canEdit: boolean; canDelete: boolean;
}) {
  const [dragOver] = useState(false);

  return (
    <div
      draggable={canEdit}
      onDragStart={e => { e.dataTransfer.setData('taskId', String(task.id)); e.dataTransfer.setData('taskStatus', task.status); }}
      className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 ${canEdit ? 'cursor-grab active:cursor-grabbing' : ''} ${dragOver ? 'ring-2 ring-indigo-400' : ''} group transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug flex-1">{task.title}</p>
        {canEdit && <GripVertical size={14} className="text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100" />}
      </div>
      {task.description && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {task.assignee_name && (
            <span className="flex items-center gap-1"><User size={11} />{task.assignee_name}</span>
          )}
          {task.due_date && (
            <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(task.due_date)}</span>
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {canEdit && (
            <button onClick={onEdit} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Edit size={12} />
            </button>
          )}
          {canDelete && (
            <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      {/* Quick status change dropdown */}
      {canEdit && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <select
            value={task.status}
            onChange={e => onStatusChange(e.target.value)}
            onClick={e => e.stopPropagation()}
            className="w-full text-xs rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            {TASK_STATUSES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ status, label, tasks, onEdit, onDelete, onStatusChange, canEdit, canDelete }: {
  status: string; label: string; tasks: Task[];
  onEdit: (t: Task) => void; onDelete: (t: Task) => void;
  onStatusChange: (taskId: number, s: string) => void;
  canEdit: boolean; canDelete: boolean;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const fromStatus = e.dataTransfer.getData('taskStatus');
    if (fromStatus !== status) onStatusChange(taskId, status);
  };

  return (
    <div
      className={`flex-1 min-w-[220px] max-w-xs rounded-xl border-t-4 ${COLUMN_HEADER_COLORS[status]} ${COLUMN_BG[status]} flex flex-col transition-colors ${isDragOver ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
        <span className="text-xs font-medium bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full px-2 py-0.5 shadow-sm">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-[120px]">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task)}
            onStatusChange={s => onStatusChange(task.id, s)}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div className="h-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-xs text-gray-300 dark:text-gray-600">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }: Props) {
  const { user: me } = useAuthContext();
  const canEdit = can(me, 'edit_task');
  const canDelete = can(me, 'delete_task');

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {TASK_STATUSES.map(({ key, label }) => (
        <KanbanColumn
          key={key}
          status={key}
          label={label}
          tasks={tasks.filter(t => t.status === key)}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}
