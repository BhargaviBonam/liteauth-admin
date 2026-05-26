import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { findById, updateUser } from '../models/userModel';
import { logActivity } from '../models/activityModel';

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const id = req.user!.id;
  const { name, currentPassword, newPassword } = req.body;
  const updates: Record<string, string> = {};
  if (name) updates.name = name;

  if (newPassword) {
    if (!currentPassword) { res.status(400).json({ data: null, error: 'Current password required' }); return; }
    const user = findById(id);
    if (!user) { res.status(404).json({ data: null, error: 'User not found' }); return; }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) { res.status(400).json({ data: null, error: 'Current password is incorrect' }); return; }
    updates.password = await bcrypt.hash(newPassword, 10);
  }

  const user = updateUser(id, updates);
  logActivity(id, req.user!.email, 'Updated profile', 'user', id);
  if (!user) { res.status(404).json({ data: null, error: 'User not found' }); return; }
  const { password: _pw, ...safeUser } = user;
  res.json({ data: safeUser, error: null });
}

export function uploadAvatar(req: Request, res: Response): void {
  if (!req.file) { res.status(400).json({ data: null, error: 'No file uploaded' }); return; }
  const avatarPath = `/uploads/avatars/${req.file.filename}`;
  updateUser(req.user!.id, { avatar: avatarPath });
  logActivity(req.user!.id, req.user!.email, 'Updated avatar', 'user', req.user!.id);
  res.json({ data: { avatar: avatarPath }, error: null });
}
