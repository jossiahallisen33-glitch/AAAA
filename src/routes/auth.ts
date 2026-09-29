/**
 * 登录相关接口。POST /login 还没有 token，不能走全局鉴权。
 */
import { Router } from "express";
import { requireAuth } from "@/middleware/require-auth";
import { writeLog } from "@/repositories/log-repository";
import { findById, findByUsername } from "@/repositories/user-repository";
import { createSession, removeSession } from "@/stores/sessions";
import type { LoginResult } from "@/types";

export const authRouter = Router();

authRouter.post("/login", (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  if (!username || !password) {
    response.status(400).json({ message: "用户名和密码都要填" });
    return;
  }

  const record = findByUsername(String(username).trim());
  if (!record || record.password !== String(password)) {
    response.status(401).json({ message: "用户名或密码不正确" });
    return;
  }

  if (record.status !== "active") {
    response.status(401).json({ message: "账号已停用" });
    return;
  }

  const token = createSession(record.id);
  const user = findById(record.id);
  if (!user) {
    response.status(500).json({ message: "服务器内部错误" });
    return;
  }

  writeLog({
    actorName: user.name,
    module: "账号",
    action: "登录",
    detail: user.username,
  });
  const result: LoginResult = { token, user };
  response.json(result);
});

authRouter.get("/me", requireAuth, (request, response) => {
  response.json(request.user);
});

authRouter.post("/logout", requireAuth, (request, response) => {
  writeLog({
    actorName: request.user.name,
    module: "账号",
    action: "退出",
    detail: request.user.username,
  });
  removeSession(request.token);
  response.status(204).end();
});
