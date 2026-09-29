/**
 * 领课业务类型。服务端仓库、路由和浏览器页面共用同一套含义。
 * 密码只出现在 UserRecord 上，回给浏览器的 User 没有 password。
 */

export type UserRole = "admin" | "teacher";
export type UserStatus = "active" | "disabled";
export type CourseStatus = "open" | "closed";
export type NoticeStatus = "published" | "draft";
export type NewsStatus = "published" | "draft";
export type MenuId = "dashboard" | "users" | "courses" | "notices" | "logs" | "news";

export interface UserRecord {
  id: number;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  email: string;
  createdAt: string;
}

export type User = Omit<UserRecord, "password">;

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

export interface CreateUserInput {
  username: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  email: string;
}

export type UpdateUserInput = Omit<CreateUserInput, "username" | "password"> & {
  password?: string;
};

export interface CreateCourseInput {
  title: string;
  summary: string;
  teacher: string;
  hours: number;
  status: CourseStatus;
  cover: string;
}

export type UpdateCourseInput = Omit<CreateCourseInput, "cover"> & {
  cover: string;
};

export interface CreateNoticeInput {
  title: string;
  content: string;
  author: string;
  status: NoticeStatus;
}

export type UpdateNoticeInput = CreateNoticeInput;

export interface CreateNewsInput {
  title: string;
  content: string;
  author: string;
  status: NewsStatus;
}

export type UpdateNewsInput = CreateNewsInput;

export interface WriteLogInput {
  actorName: string;
  module: string;
  action: string;
  detail: string;
}

export interface Session {
  userId: number;
  createdAt: number;
}
