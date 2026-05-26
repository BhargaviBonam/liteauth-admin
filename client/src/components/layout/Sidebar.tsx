import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, Shield, Activity, User, Settings, LogOut, Lock } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { can } from '../../utils/permissions';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, always: true },
  { to: '/users', label: 'Users', icon: Users, perm: 'edit_user' as const },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare, perm: 'view_analytics' as const },
  { to: '/roles', label: 'Roles', icon: Shield, perm: 'edit_user' as const },
  { to: '/activity-logs', label: 'Activity Logs', icon: Activity, perm: 'view_activity_logs' as const },
  { to: '/profile', label: 'Profile', icon: User, always: true },
  { to: '/settings', label: 'Settings', icon: Settings, always: true },
];

export function Sidebar() {
  const { user, logout } = useAuthContext();
  return (
    <aside className="w-60 min-h-screen bg-gray-900 dark:bg-gray-950 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Lock size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">LiteAuth</span>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon, always, perm }) => {
          if (!always && perm && !can(user, perm)) return null;
          return (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <Icon size={17} />
              {label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-800">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white w-full transition-colors">
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
