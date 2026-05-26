import { Request, Response } from 'express';
import { getAllRoles, updateRolePermissions, Permission, Role } from '../utils/permissions';
import { logActivity } from '../models/activityModel';

export function getRoles(_req: Request, res: Response): void {
  res.json({ data: getAllRoles(), error: null });
}

export function updatePermissions(req: Request, res: Response): void {
  const role = req.params.role as Role;
  const { permissions } = req.body as { permissions: Permission[] };
  updateRolePermissions(role, permissions);
  logActivity(req.user!.id, req.user!.email, `Updated permissions for role: ${role}`, 'role');
  res.json({ data: { role, permissions }, error: null });
}
