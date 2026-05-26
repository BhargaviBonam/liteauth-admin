import db from './db';
import bcrypt from 'bcrypt';

export function seedDatabase() {
  const existing = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (existing.count > 0) return;

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  const insert = db.prepare(`
    INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, 'active')
  `);

  insert.run('Super Admin', 'admin@liteauth.dev', hash('Admin@123'), 'super_admin');
  insert.run('Alice Manager', 'manager@liteauth.dev', hash('Manager@123'), 'manager');
  insert.run('Bob Viewer', 'viewer@liteauth.dev', hash('Viewer@123'), 'viewer');
  insert.run('Carol Admin', 'carol@liteauth.dev', hash('Carol@123'), 'admin');

  // Seed some tasks
  const insertTask = db.prepare(`
    INSERT INTO tasks (title, description, assigned_to, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertTask.run('Setup CI/CD Pipeline', 'Configure GitHub Actions for automated testing', 1, 'in_progress', 'high', '2026-06-01');
  insertTask.run('Write API documentation', 'Document all REST endpoints', 2, 'todo', 'medium', '2026-06-15');
  insertTask.run('Fix login bug', 'Users get logged out randomly', 4, 'done', 'high', '2026-05-30');
  insertTask.run('Add dark mode', 'Implement dark mode toggle', 3, 'backlog', 'low', '2026-07-01');
  insertTask.run('Database optimization', 'Add indexes to slow queries', 1, 'in_review', 'medium', '2026-06-20');
  insertTask.run('Update onboarding flow', 'Redesign the user onboarding steps', 2, 'backlog', 'low', '2026-07-10');
  insertTask.run('Security audit', 'Review auth tokens and permissions', 4, 'todo', 'high', '2026-06-05');
  insertTask.run('Payment gateway integration', 'Blocked on vendor API access', 3, 'blocked', 'high', '2026-06-08');

  // Seed some activity logs
  const insertLog = db.prepare(`
    INSERT INTO activity_logs (user_id, actor_name, action, target_type, target_id) VALUES (?, ?, ?, ?, ?)
  `);
  insertLog.run(1, 'Super Admin', 'Created user manager@liteauth.dev', 'user', 2);
  insertLog.run(1, 'Super Admin', 'Created user viewer@liteauth.dev', 'user', 3);
  insertLog.run(1, 'Super Admin', 'Created task: Setup CI/CD Pipeline', 'task', 1);
  insertLog.run(4, 'Carol Admin', 'Updated task status to completed: Fix login bug', 'task', 3);
  insertLog.run(2, 'Alice Manager', 'Created task: Write API documentation', 'task', 2);

  console.log('Database seeded successfully');
}
