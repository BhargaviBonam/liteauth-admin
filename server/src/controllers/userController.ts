import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as UserModel from '../models/userModel';
import { logActivity } from '../models/activityModel';

export function getUsers(req: Request, res: Response): void {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const role = req.query.role as string;
  const status = req.query.status as string;

  const result = UserModel.listUsers({ page, limit, search, role, status });
  res.json({ data: result.users, error: null, meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages } });
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ data: null, error: 'All fields are required' });
    return;
  }

  const existing = UserModel.findByEmail(email.toLowerCase());
  if (existing) {
    res.status(400).json({ data: null, error: 'Email already in use' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = UserModel.createUser({ name, email: email.toLowerCase(), password: hashed, role });
  if (!user) { res.status(500).json({ data: null, error: 'Failed to create user' }); return; }

  const actor = req.user!;
  logActivity(actor.id, actor.email, `Created user ${email}`, 'user', user.id);

  const { password: _pw, ...safeUser } = user;
  res.status(201).json({ data: safeUser, error: null });
}

export function getUser(req: Request, res: Response): void {
  const user = UserModel.findById(parseInt(req.params.id));
  if (!user) { res.status(404).json({ data: null, error: 'User not found' }); return; }
  const { password: _pw, ...safeUser } = user;
  res.json({ data: safeUser, error: null });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);
  const { name, email, role, password } = req.body;
  const updates: Record<string, string> = {};
  if (name) updates.name = name;
  if (email) updates.email = email.toLowerCase();
  if (role) updates.role = role;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const user = UserModel.updateUser(id, updates);
  if (!user) { res.status(404).json({ data: null, error: 'User not found' }); return; }

  logActivity(req.user!.id, req.user!.email, `Updated user ${user.email}`, 'user', id);
  const { password: _pw, ...safeUser } = user;
  res.json({ data: safeUser, error: null });
}

export function deleteUser(req: Request, res: Response): void {
  const id = parseInt(req.params.id);
  if (req.user!.id === id) {
    res.status(403).json({ data: null, error: 'Cannot delete your own account' });
    return;
  }
  const user = UserModel.findById(id);
  if (!user) { res.status(404).json({ data: null, error: 'User not found' }); return; }
  UserModel.deleteUser(id);
  logActivity(req.user!.id, req.user!.email, `Deleted user ${user.email}`, 'user', id);
  res.json({ data: { message: 'User deleted' }, error: null });
}

export function toggleStatus(req: Request, res: Response): void {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const user = UserModel.toggleStatus(id, status);
  if (!user) { res.status(404).json({ data: null, error: 'User not found' }); return; }
  logActivity(req.user!.id, req.user!.email, `Set user ${user.email} status to ${status}`, 'user', id);
  res.json({ data: { id: user.id, status: user.status }, error: null });
}
