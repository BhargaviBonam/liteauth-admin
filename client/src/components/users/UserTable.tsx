import type { User } from '../../types';
import { Avatar } from '../shared/Avatar';
import { UserStatusBadge, RoleBadge } from './UserStatusBadge';
import { formatDate } from '../../utils/formatters';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { can } from '../../utils/permissions';

interface Props {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
  onToggle: (u: User) => void;
}

export function UserTable({ users, onEdit, onDelete, onToggle }: Props) {
  const { user: me } = useAuthContext();
  if (users.length === 0) return <div className="text-center py-12 text-gray-400">No users found.</div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
          <tr>
            {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} avatar={u.avatar} size="sm" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                    <p className="text-gray-400 text-xs">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
              <td className="px-4 py-3"><UserStatusBadge status={u.status} /></td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(u.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {can(me, 'edit_user') && (
                    <>
                      <button onClick={() => onEdit(u)} title="Edit" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => onToggle(u)} title={u.status === 'active' ? 'Deactivate' : 'Activate'} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        {u.status === 'active' ? <ToggleRight size={15} className="text-green-500" /> : <ToggleLeft size={15} />}
                      </button>
                    </>
                  )}
                  {can(me, 'delete_user') && me?.id !== u.id && (
                    <button onClick={() => onDelete(u)} title="Delete" className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
