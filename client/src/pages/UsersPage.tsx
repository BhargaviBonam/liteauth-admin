import { useEffect, useState, useCallback } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { UserTable } from '../components/users/UserTable';
import { UserForm } from '../components/users/UserForm';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { SearchInput } from '../components/shared/SearchInput';
import { Pagination } from '../components/shared/Pagination';
import { userService } from '../services/userService';
import type { User, PaginatedMeta } from '../types';
import { useAuthContext } from '../context/AuthContext';
import { can } from '../utils/permissions';
import { UserPlus } from 'lucide-react';

export function UsersPage() {
  const { user: me } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<User | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<User | null>(null);

  const load = useCallback(async () => {
    const r = await userService.list({ page, limit: 10, search, role: roleFilter, status: statusFilter });
    setUsers(r.users); setMeta(r.meta);
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: { name: string; email: string; password: string; role: string }) => {
    if (editing) {
      await userService.update(editing.id, { name: data.name, email: data.email, role: data.role, ...(data.password ? { password: data.password } : {}) });
    } else {
      await userService.create(data);
    }
    setEditing(undefined); load();
  };

  const handleDelete = async () => {
    if (deleting) { await userService.remove(deleting.id); setDeleting(null); load(); }
  };

  const handleToggle = async (u: User) => {
    await userService.toggleStatus(u.id, u.status === 'active' ? 'inactive' : 'active');
    load();
  };

  return (
    <PageWrapper title="User Management">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by name or email…" />
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="input-field text-sm py-2 w-36">
            <option value="">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field text-sm py-2 w-32">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {can(me, 'create_user') && (
            <button onClick={() => setEditing(null)}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
              <UserPlus size={16} /> New User
            </button>
          )}
        </div>
        <UserTable users={users} onEdit={setEditing} onDelete={setDeleting} onToggle={handleToggle} />
        <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPage={setPage} />
      </div>
      {editing !== undefined && <UserForm user={editing} onSave={handleSave} onClose={() => setEditing(undefined)} />}
      <ConfirmDialog open={!!deleting} title="Delete User" message={`Are you sure you want to delete ${deleting?.name}?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
    </PageWrapper>
  );
}
