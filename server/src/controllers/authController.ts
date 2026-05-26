import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { findByEmail, findById } from '../models/userModel';
import { signToken } from '../utils/jwt';
import { logActivity } from '../models/activityModel';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ data: null, error: 'Email and password are required' });
    return;
  }

  const user = findByEmail(email.toLowerCase());
  if (!user) {
    res.status(401).json({ data: null, error: 'Invalid email or password' });
    return;
  }

  if (user.status === 'inactive') {
    res.status(401).json({ data: null, error: 'Account is deactivated' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ data: null, error: 'Invalid email or password' });
    return;
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  logActivity(user.id, user.name, 'Logged in', 'auth', user.id);

  const { password: _pw, ...safeUser } = user;
  res.json({ data: { user: safeUser, accessToken: token }, error: null });
}

export function logout(req: Request, res: Response): void {
  if (req.user) {
    const user = findById(req.user.id);
    if (user) logActivity(user.id, user.name, 'Logged out', 'auth', user.id);
  }
  res.json({ data: { message: 'Logged out successfully' }, error: null });
}

export function getMe(req: Request, res: Response): void {
  const user = findById(req.user!.id);
  if (!user) {
    res.status(404).json({ data: null, error: 'User not found' });
    return;
  }
  const { password: _pw, ...safeUser } = user;
  res.json({ data: safeUser, error: null });
}
