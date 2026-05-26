import db from '../database/db';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  avatar: string | null;
  created_at: string;
}

export function findByEmail(email: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
}

export function findById(id: number): User | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

export interface ListUsersOptions {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
}

export function listUsers(opts: ListUsersOptions) {
  const { page, limit, search, role, status } = opts;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params: unknown[] = [];

  if (search) {
    where += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (role) { where += ' AND role = ?'; params.push(role); }
  if (status) { where += ' AND status = ?'; params.push(status); }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM users ${where}`).get(...params) as { count: number }).count;
  const users = db.prepare(`SELECT id, name, email, role, status, avatar, created_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset) as Omit<User, 'password'>[];

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function createUser(data: { name: string; email: string; password: string; role: string }) {
  const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(data.name, data.email, data.password, data.role);
  return findById(result.lastInsertRowid as number);
}

export function updateUser(id: number, data: Partial<{ name: string; email: string; role: string; password: string; avatar: string }>) {
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);
  db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(...values, id);
  return findById(id);
}

export function deleteUser(id: number) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

export function toggleStatus(id: number, status: string) {
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
  return findById(id);
}

export function countByDate() {
  return db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as count
    FROM users
    GROUP BY date(created_at)
    ORDER BY date(created_at) DESC
    LIMIT 30
  `).all() as { date: string; count: number }[];
}
