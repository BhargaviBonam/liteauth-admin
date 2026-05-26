import { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { RoleCard } from '../components/roles/RoleCard';
import type { RoleInfo } from '../types';
import api from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import { can } from '../utils/permissions';
import { Save } from 'lucide-react';

export function RolesPage() {
  const { user: me } = useAuthContext();
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [changed, setChanged] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/roles').then(r => setRoles(r.data.data));
  }, []);

  const handleChange = (role: string, perms: string[]) => {
    setRoles(prev => prev.map(r => r.role === role ? { ...r, permissions: perms } : r));
    setChanged(prev => ({ ...prev, [role]: perms }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(Object.entries(changed).map(([role, permissions]) =>
        api.put(`/roles/${role}/permissions`, { permissions })
      ));
      setChanged({});
    } finally { setSaving(false); }
  };

  const canManage = can(me, 'manage_roles');

  return (
    <PageWrapper title="Roles & Permissions">
      <div className="space-y-4">
        {canManage && Object.keys(changed).length > 0 && (
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-60">
              <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        )}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {roles.map(r => (
            <RoleCard key={r.role} role={r} editable={canManage} onChange={handleChange} />
          ))}
        </div>
        {!canManage && <p className="text-sm text-gray-400 text-center">You need Super Admin role to modify permissions.</p>}
      </div>
    </PageWrapper>
  );
}
