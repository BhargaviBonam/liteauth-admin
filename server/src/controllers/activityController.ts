import { Request, Response } from 'express';
import { listLogs, getRecentLogs } from '../models/activityModel';
import { countByDate } from '../models/userModel';
import db from '../database/db';

export function getLogs(req: Request, res: Response): void {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = listLogs(page, limit);
  res.json({ data: result.logs, error: null, meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages } });
}

export function getStats(_req: Request, res: Response): void {
  const totalUsers    = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  const activeUsers   = (db.prepare("SELECT COUNT(*) as count FROM users WHERE status = 'active'").get() as { count: number }).count;
  const totalTasks    = (db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number }).count;

  // Count each Jira-style status
  const count = (s: string) =>
    (db.prepare('SELECT COUNT(*) as count FROM tasks WHERE status = ?').get(s) as { count: number }).count;

  const tasksByStatus = {
    backlog:     count('backlog'),
    todo:        count('todo'),
    in_progress: count('in_progress'),
    in_review:   count('in_review'),
    done:        count('done'),
    blocked:     count('blocked'),
  };

  const registrationTrend = countByDate();
  const recentLogs = getRecentLogs(10);

  res.json({
    data: {
      totalUsers,
      activeUsers,
      totalTasks,
      tasksByStatus,
      registrationTrend,
      recentLogs,
    },
    error: null,
  });
}
