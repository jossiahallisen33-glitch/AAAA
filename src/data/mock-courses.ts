/**
 * 课程 Mock 数据。封面是静态图地址，真实文件在 public/uploads/covers。
 */
import type { Course } from "@/types";

export const mockCourses: Course[] = [
  {
    id: 1,
    title: "Node.js 基础班",
    summary: "从运行环境讲到模块化，把命令行小服务跑通。",
    teacher: "李明",
    hours: 24,
    status: "open",
    cover: "/uploads/covers/node.svg",
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: 2,
    title: "Express 实战班",
    summary: "路由、中间件、静态资源和 REST 接口连成一套后台。",
    teacher: "王芳",
    hours: 32,
    status: "open",
    cover: "/uploads/covers/express.svg",
    createdAt: "2026-03-18T09:00:00.000Z",
  },
  {
    id: 3,
    title: "前端联调班",
    summary: "用 Fetch 对接 JSON 接口，完成登录后的管理页面。",
    teacher: "李明",
    hours: 16,
    status: "closed",
    cover: "/uploads/covers/frontend.svg",
    createdAt: "2026-04-08T10:00:00.000Z",
  },
];
