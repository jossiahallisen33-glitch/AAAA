/**
 * 浏览器侧用到的接口形状。和服务器回给页面的 JSON 一致，不含密码。
 */

export type UserRole = "admin" | "teacher";
export type UserStatus = "active" | "disabled";
export type CourseStatus = "open" | "closed";
export type NoticeStatus = "published" | "draft";
export type NewsStatus = "published" | "draft";
export type MenuId = "dashboard" | "users" | "courses" | "notices" | "logs" | "news";

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  email: string;
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  summary: string;
  teacher: string;
  hours: number;
  status: CourseStatus;
  cover: string;
  createdAt: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  status: NoticeStatus;
  createdAt: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  author: string;
  status: NewsStatus;
  createdAt: string;
}

export interface OperationLog {
  id: number;
  actorName: string;
  module: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface MenuItem {
  id: MenuId;
  title: string;
  path: string;
  icon: string;
}

export interface DashboardStats {
  userCount: number;
  courseCount: number;
  noticeCount: number;
  logCount: number;
}

export interface LoginResult {
  token: string;
  user: User;
}

export interface UserPayload {
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface CoursePayload {
  title: string;
  summary: string;
  teacher: string;
  hours: string;
  status: CourseStatus;
  coverData?: string;
}

export interface NoticePayload {
  title: string;
  author: string;
  content: string;
  status: NoticeStatus;
}

export interface NewsPayload {
  title: string;
  author: string;
  content: string;
  status: NewsStatus;
}
