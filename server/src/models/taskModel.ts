import db from '../database/db';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  assignee_name?: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
}

export interface ListTasksOptions {
  page: number;
  limit: number;
  status?: string;
  priority?: string;
  assignedTo?: number;
}

export function listTasks(opts: ListTasksOptions) {
  const { page, limit, status, priority, assignedTo } = opts;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params: unknown[] = [];

  if (status) { where += ' AND t.status = ?'; params.push(status); }
  if (priority) { where += ' AND t.priority = ?'; params.push(priority); }
  if (assignedTo) { where += ' AND t.assigned_to = ?'; params.push(assignedTo); }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM tasks t ${where}`).get(...params) as { count: number }).count;
  const tasks = db.prepare(`
    SELECT t.*, u.name as assignee_name FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    ${where} ORDER BY t.created_at DESC LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as Task[];

  return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function createTask(data: { title: string; description?: string; assigned_to?: number; priority: string; due_date?: string }) {
  const result = db.prepare(`
    INSERT INTO tasks (title, description, assigned_to, priority, due_date) VALUES (?, ?, ?, ?, ?)
  `).run(data.title, data.description || null, data.assigned_to || null, data.priority, data.due_date || null);
  return db.prepare('SELECT t.*, u.name as assignee_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?').get(result.lastInsertRowid) as Task;
}

export function updateTask(id: number, data: Partial<{ title: string; description: string; assigned_to: number; status: string; priority: string; due_date: string }>) {
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);
  db.prepare(`UPDATE tasks SET ${fields} WHERE id = ?`).run(...values, id);
  return db.prepare('SELECT t.*, u.name as assignee_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?').get(id) as Task;
}

export function deleteTask(id: number) {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}
