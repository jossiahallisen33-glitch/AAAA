/**
 * 后台账号的初始 Mock 数据。明文密码只用于课堂演示。
 */
import type { UserRecord } from "@/types";

export const mockUsers: UserRecord[] = [
  {
    id: 1,
    username: "admin",
    password: "123456",
    name: "系统管理员",
    role: "admin",
    status: "active",
    email: "admin@course.local",
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: 2,
    username: "ming",
    password: "123456",
    name: "李明",
    role: "teacher",
    status: "active",
    email: "ming@course.local",
    createdAt: "2026-03-12T09:30:00.000Z",
  },
  {
    id: 3,
    username: "fang",
    password: "123456",
    name: "王芳",
    role: "teacher",
    status: "disabled",
    email: "fang@course.local",
    createdAt: "2026-04-02T14:10:00.000Z",
  },
];
