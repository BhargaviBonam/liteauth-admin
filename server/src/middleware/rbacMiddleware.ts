import { Request, Response, NextFunction } from 'express';
import { hasPermission, Permission, Role } from '../utils/permissions';

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role as Role;
    if (!role || !hasPermission(role, permission)) {
      res.status(403).json({ data: null, error: 'Forbidden: insufficient permissions' });
      return;
    }
    next();
  };
}
