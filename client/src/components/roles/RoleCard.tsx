import type { RoleInfo } from '../../types';

const ALL_PERMISSIONS = [
  { key: 'create_user', label: 'Create User' },
  { key: 'edit_user', label: 'Edit User' },
  { key: 'delete_user', label: 'Delete User' },
  { key: 'create_task', label: 'Create Task' },
  { key: 'edit_task', label: 'Edit Task' },
  { key: 'delete_task', label: 'Delete Task' },
  { key: 'manage_roles', label: 'Manage Roles' },
  { key: 'view_analytics', label: 'View Analytics' },
  { key: 'view_activity_logs', label: 'View Activity Logs' },
];

interface Props { role: RoleInfo; editable: boolean; onChange?: (role: string, perms: string[]) => void; }

export function RoleCard({ role, editable, onChange }: Props) {
  const toggle = (perm: string) => {
    if (!onChange) return;
    const current = role.permissions;
    const next = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
    onChange(role.role, next);
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{role.label}</h3>
      <div className="space-y-2">
        {ALL_PERMISSIONS.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={role.permissions.includes(key)} onChange={() => toggle(key)}
              disabled={!editable}
              className="w-4 h-4 rounded accent-indigo-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
