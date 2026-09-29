/**
 * 用户资源。成功后 writeLog。
 */
import { Router } from "express";
import { queryText } from "@/query";
import { writeLog } from "@/repositories/log-repository";
import {
  create,
  findAll,
  findById,
  findByUsername,
  remove,
  update,
} from "@/repositories/user-repository";
import type { CreateUserInput, UpdateUserInput, UserRole, UserStatus } from "@/types";

export const usersRouter = Router();

const roles = new Set<UserRole>(["admin", "teacher"]);
const statuses = new Set<UserStatus>(["active", "disabled"]);

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && roles.has(value as UserRole);
}

function isUserStatus(value: unknown): value is UserStatus {
  return typeof value === "string" && statuses.has(value as UserStatus);
}

function valid(
  body: Record<string, unknown>,
  options: { requirePassword: boolean },
): string {
  const { username, name, email, role, status, password } = body;

  if (typeof name !== "string" || !name.trim()) return "姓名不能为空";
  if (typeof email !== "string" || !email.trim()) return "邮箱不能为空";
  if (!isUserRole(role)) return "角色只能是 admin 或 teacher";
  if (!isUserStatus(status)) return "状态只能是 active 或 disabled";

  if (options.requirePassword) {
    if (typeof username !== "string" || !username.trim()) {
      return "用户名不能为空";
    }
    if (typeof password !== "string" || !password) {
      return "密码不能为空";
    }
  }

  return "";
}

usersRouter.get("/", (request, response) => {
  response.json(findAll(queryText(request.query.keyword)));
});

usersRouter.get("/:id", (request, response) => {
  const item = findById(request.params.id);
  item
    ? response.json(item)
    : response.status(404).json({ message: "用户不存在" });
});

usersRouter.post("/", (request, response) => {
  const body = request.body as Record<string, unknown>;
  const message = valid(body, { requirePassword: true });
  if (message) {
    response.status(400).json({ message });
    return;
  }

  const username = String(body.username).trim();
  if (findByUsername(username)) {
    response.status(409).json({ message: "用户名已存在" });
    return;
  }

  const payload: CreateUserInput = {
    username,
    password: String(body.password),
    name: String(body.name),
    email: String(body.email),
    role: body.role as UserRole,
    status: body.status as UserStatus,
  };
  const item = create(payload);
  writeLog({
    actorName: request.user.name,
    module: "用户",
    action: "新增",
    detail: item.username,
  });
  response.status(201).json(item);
});

usersRouter.put("/:id", (request, response) => {
  const body = request.body as Record<string, unknown>;
  const message = valid(body, { requirePassword: false });
  if (message) {
    response.status(400).json({ message });
    return;
  }

  const payload: UpdateUserInput = {
    password: typeof body.password === "string" ? body.password : "",
    name: String(body.name),
    email: String(body.email),
    role: body.role as UserRole,
    status: body.status as UserStatus,
  };
  const item = update(request.params.id, payload);
  if (!item) {
    response.status(404).json({ message: "用户不存在" });
    return;
  }

  writeLog({
    actorName: request.user.name,
    module: "用户",
    action: "修改",
    detail: item.username,
  });
  response.json(item);
});

usersRouter.delete("/:id", (request, response) => {
  const current = findById(request.params.id);
  if (!current) {
    response.status(404).json({ message: "用户不存在" });
    return;
  }

  if (current.id === request.user.id) {
    response.status(400).json({ message: "不能删除当前登录账号" });
    return;
  }

  remove(request.params.id);
  writeLog({
    actorName: request.user.name,
    module: "用户",
    action: "删除",
    detail: current.username,
  });
  response.status(204).end();
});
