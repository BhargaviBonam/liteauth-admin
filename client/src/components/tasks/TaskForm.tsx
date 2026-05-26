import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Task, User } from '../../types';
import { X } from 'lucide-react';
import { userService } from '../../services/userService';

interface FormData { title: string; description: string; priority: string; due_date: string; assigned_to: string; status: string; }
interface Props { task?: Task | null; onSave: (d: FormData) => Promise<void>; onClose: () => void; }

export function TaskForm({ task, onSave, onClose }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userService.list({ limit: 100 }).then(r => setUsers(r.users));
    reset(task ? {
      title: task.title, description: task.description || '', priority: task.priority,
      due_date: task.due_date ? task.due_date.slice(0, 10) : '', assigned_to: task.assigned_to?.toString() || '', status: task.status
    } : { title: '', description: '', priority: 'medium', due_date: '', assigned_to: '', status: 'backlog' });
  }, [task, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input {...register('title', { required: 'Required' })} className="input-field" placeholder="Task title" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea {...register('description')} className="input-field" rows={3} placeholder="Optional description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select {...register('priority')} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input-field">
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Due Date</label>
            <input {...register('due_date')} type="date" className="input-field" />
          </div>
          <div>
            <label className="label">Assign To</label>
            <select {...register('assigned_to')} className="input-field">
              <option value="">Unassigned</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
