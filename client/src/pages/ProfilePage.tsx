import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useAuthContext } from '../context/AuthContext';
import { Avatar } from '../components/shared/Avatar';
import api from '../services/api';

export function ProfilePage() {
  const { user, refreshUser } = useAuthContext();
  const [name, setName] = useState(user?.name || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    setSaving(true);
    try {
      const payload: Record<string, string> = { name };
      if (newPw) { payload.currentPassword = currentPw; payload.newPassword = newPw; }
      await api.put('/profile', payload);
      await refreshUser();
      setMsg('Profile updated successfully!');
      setCurrentPw(''); setNewPw('');
    } catch (e: unknown) {
      setErr((e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <PageWrapper title="Profile">
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user?.name || ''} avatar={user?.avatar} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
          {msg && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm">{msg}</div>}
          {err && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">{err}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Change Password</p>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="input-field" placeholder="Leave blank to keep current" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">New Password</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="input-field" />
            </div>
            <button type="submit" disabled={saving} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
