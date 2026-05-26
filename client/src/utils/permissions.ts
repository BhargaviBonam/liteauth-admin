import type { User } from '../types';

type Permission = 'create_user' | 'edit_user' | 'delete_user' | 'create_task' | 'edit_task' | 'delete_task' | 'manage_roles' | 'view_analytics' | 'view_activity_logs';

const matrix: Record<string, Permission[]> = {
  super_admin: ['create_user','edit_user','delete_user','create_task','edit_task','delete_task','manage_roles','view_analytics','view_activity_logs'],
  admin: ['create_user','edit_user','delete_user','create_task','edit_task','delete_task','view_analytics','view_activity_logs'],
  manager: ['create_task','edit_task','view_analytics','view_activity_logs'],
  viewer: ['view_analytics'],
};

export function can(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  return matrix[user.role]?.includes(permission) ?? false;
}
