export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'viewer';
  status: 'active' | 'inactive';
  avatar: string | null;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  assignee_name: string | null;
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  actor_name: string;
  action: string;
  target_type: string | null;
  target_id: number | null;
  created_at: string;
}

export interface RoleInfo {
  role: string;
  label: string;
  permissions: string[];
}

export interface TasksByStatus {
  backlog: number;
  todo: number;
  in_progress: number;
  in_review: number;
  done: number;
  blocked: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  tasksByStatus: TasksByStatus;
  registrationTrend: { date: string; count: number }[];
  recentLogs: ActivityLog[];
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  meta?: PaginatedMeta;
}
