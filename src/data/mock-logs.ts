/**
 * 操作日志初始记录。正式写入走仓库的 writeLog。
 */
import type { OperationLog } from "@/types";

export const mockLogs: OperationLog[] = [
  {
    id: 1,
    actorName: "系统管理员",
    module: "用户",
    action: "登录",
    detail: "admin 进入领课",
    createdAt: "2026-04-08T08:01:00.000Z",
  },
  {
    id: 2,
    actorName: "李明",
    module: "课程",
    action: "修改",
    detail: "Express 实战班",
    createdAt: "2026-04-08T09:12:00.000Z",
  },
  {
    id: 3,
    actorName: "系统管理员",
    module: "公告",
    action: "发布",
    detail: "春季班开课安排",
    createdAt: "2026-04-08T10:40:00.000Z",
  },
];
