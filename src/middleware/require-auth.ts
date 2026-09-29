/**
 * 鉴权中间件：确认「你是谁」，再让请求进入业务接口。
 */
import type { NextFunction, Request, Response } from "express";
import { findById } from "@/repositories/user-repository";
import { findSession } from "@/stores/sessions";

export function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const header = request.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = token ? findSession(token) : null;
  const user = session ? findById(session.userId) : null;

  if (!user) {
    response.status(401).json({ message: "请先登录" });
    return;
  }

  if (user.status !== "active") {
    response.status(401).json({ message: "账号已停用" });
    return;
  }

  request.token = token;
  request.user = user;
  next();
}
