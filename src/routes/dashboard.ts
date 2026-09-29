/**
 * 工作台四个数字。统一问仓库，不在路由里直接读数组长度。
 */
import { Router } from "express";
import { countCourses } from "@/repositories/course-repository";
import { countLogs } from "@/repositories/log-repository";
import { countNotices } from "@/repositories/notice-repository";
import { countUsers } from "@/repositories/user-repository";
import type { DashboardStats } from "@/types";

export const dashboardRouter = Router();

dashboardRouter.get("/", (_request, response) => {
  const stats: DashboardStats = {
    userCount: countUsers(),
    courseCount: countCourses(),
    noticeCount: countNotices(),
    logCount: countLogs(),
  };
  response.json(stats);
});
