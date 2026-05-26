export type Role = 'super_admin' | 'admin' | 'manager' | 'viewer';

export type Permission =
  | 'create_user' | 'edit_user' | 'delete_user'
  | 'create_task' | 'edit_task' | 'delete_task'
  | 'manage_roles' | 'view_analytics' | 'view_activity_logs';

// Default permission matrix - can be overridden at runtime
let permissionMatrix: Record<Role, Permission[]> = {
  super_admin: ['create_user', 'edit_user', 'delete_user', 'create_task', 'edit_task', 'delete_task', 'manage_roles', 'view_analytics', 'view_activity_logs'],
  admin: ['create_user', 'edit_user', 'delete_user', 'create_task', 'edit_task', 'delete_task', 'view_analytics', 'view_activity_logs'],
  manager: ['create_task', 'edit_task', 'view_analytics', 'view_activity_logs'],
  viewer: ['view_analytics'],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return permissionMatrix[role]?.includes(permission) ?? false;
}

export function getRolePermissions(role: Role): Permission[] {
  return permissionMatrix[role] || [];
}

export function getAllRoles(): { role: Role; label: string; permissions: Permission[] }[] {
  return [
    { role: 'super_admin', label: 'Super Admin', permissions: permissionMatrix.super_admin },
    { role: 'admin', label: 'Admin', permissions: permissionMatrix.admin },
    { role: 'manager', label: 'Manager', permissions: permissionMatrix.manager },
    { role: 'viewer', label: 'Viewer', permissions: permissionMatrix.viewer },
  ];
}

export function updateRolePermissions(role: Role, permissions: Permission[]): void {
  permissionMatrix[role] = permissions;
}
