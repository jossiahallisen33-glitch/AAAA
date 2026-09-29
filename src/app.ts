/**
 * 领课入口：读 JSON、公开 public、按前缀挂路由。
 * 运行：npm start
 * 打开 http://localhost:3000
 */
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { HttpError, isParseError } from "@/http-error";
import { requireAuth } from "@/middleware/require-auth";
import { publicDirectory } from "@/paths";
import { authRouter } from "@/routes/auth";
import { coursesRouter } from "@/routes/courses";
import { dashboardRouter } from "@/routes/dashboard";
import { logsRouter } from "@/routes/logs";
import { menusRouter } from "@/routes/menus";
import { newsRouter } from "@/routes/news";
import { noticesRouter } from "@/routes/notices";
import { usersRouter } from "@/routes/users";

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(express.static(publicDirectory));

app.use("/api/auth", authRouter);
app.use("/api/menus", requireAuth, menusRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);
app.use("/api/users", requireAuth, usersRouter);
app.use("/api/courses", requireAuth, coursesRouter);
app.use("/api/notices", requireAuth, noticesRouter);
app.use("/api/news", requireAuth, newsRouter);
app.use("/api/logs", requireAuth, logsRouter);

app.use((request, response) => {
  if (request.path.startsWith("/api/")) {
    response.status(404).json({ message: "没有这个地址" });
    return;
  }
  response.status(404).send("没有这个页面");
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  if (isParseError(error)) {
    response.status(400).json({ message: "请求体不是合法 JSON" });
    return;
  }
  if (error instanceof HttpError) {
    response.status(error.status).json({ message: error.message });
    return;
  }
  response.status(500).json({ message: "服务器内部错误" });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
