import { Request, Response } from 'express';
import * as TaskModel from '../models/taskModel';
import { logActivity } from '../models/activityModel';

export function getTasks(req: Request, res: Response): void {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;
  const priority = req.query.priority as string;
  const assignedTo = req.query.assignedTo ? parseInt(req.query.assignedTo as string) : undefined;

  const result = TaskModel.listTasks({ page, limit, status, priority, assignedTo });
  res.json({ data: result.tasks, error: null, meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages } });
}

export function createTask(req: Request, res: Response): void {
  const { title, description, assigned_to, priority, due_date } = req.body;
  if (!title) { res.status(400).json({ data: null, error: 'Title is required' }); return; }

  const task = TaskModel.createTask({ title, description, assigned_to, priority: priority || 'medium', due_date });
  logActivity(req.user!.id, req.user!.email, `Created task: ${title}`, 'task', task.id);
  res.status(201).json({ data: task, error: null });
}

export function updateTask(req: Request, res: Response): void {
  const id = parseInt(req.params.id);
  const { title, description, assigned_to, status, priority, due_date } = req.body;
  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (assigned_to !== undefined) updates.assigned_to = assigned_to;
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (due_date !== undefined) updates.due_date = due_date;

  const task = TaskModel.updateTask(id, updates as Parameters<typeof TaskModel.updateTask>[1]);
  if (!task) { res.status(404).json({ data: null, error: 'Task not found' }); return; }
  logActivity(req.user!.id, req.user!.email, `Updated task: ${task.title}`, 'task', id);
  res.json({ data: task, error: null });
}

export function deleteTask(req: Request, res: Response): void {
  const id = parseInt(req.params.id);
  TaskModel.deleteTask(id);
  logActivity(req.user!.id, req.user!.email, `Deleted task #${id}`, 'task', id);
  res.json({ data: { message: 'Task deleted' }, error: null });
}
