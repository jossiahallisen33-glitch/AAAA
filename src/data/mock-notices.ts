/**
 * 公告 Mock。status 为 published（已发布）或 draft（草稿）。
 */
import type { Notice } from "@/types";

export const mockNotices: Notice[] = [
  {
    id: 1,
    title: "春季班开课安排",
    content: "3 月 9 日起正常上课，请各班老师提前在领课里核对教室。",
    author: "系统管理员",
    status: "published",
    createdAt: "2026-03-01T08:00:00.000Z",
  },
  {
    id: 2,
    title: "作业提交截止提醒",
    content: "Express 实战班本周日 24:00 截止。逾期按未交处理。",
    author: "李明",
    status: "published",
    createdAt: "2026-03-18T09:20:00.000Z",
  },
  {
    id: 3,
    title: "暑假班招生文案（草稿）",
    content: "文案还在改，先不要发到学员群。",
    author: "王芳",
    status: "draft",
    createdAt: "2026-04-02T14:10:00.000Z",
  },
];
