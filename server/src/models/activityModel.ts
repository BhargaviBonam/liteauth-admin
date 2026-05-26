import db from '../database/db';

export interface ActivityLog {
  id: number;
  user_id: number | null;
  actor_name: string;
  action: string;
  target_type: string | null;
  target_id: number | null;
  created_at: string;
}

export function logActivity(userId: number | null, actorName: string, action: string, targetType?: string, targetId?: number) {
  db.prepare(`
    INSERT INTO activity_logs (user_id, actor_name, action, target_type, target_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, actorName, action, targetType || null, targetId || null);
}

export function listLogs(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const total = (db.prepare('SELECT COUNT(*) as count FROM activity_logs').get() as { count: number }).count;
  const logs = db.prepare('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset) as ActivityLog[];
  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function getRecentLogs(limit = 10) {
  return db.prepare('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?').all(limit) as ActivityLog[];
}
