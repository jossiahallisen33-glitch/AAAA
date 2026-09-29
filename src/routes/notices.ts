/**
 * 公告资源。字段带草稿 / 已发布。
 */
import { Router } from "express";
import { queryText } from "@/query";
import { writeLog } from "@/repositories/log-repository";
import {
  create,
  findAll,
  findById,
  remove,
  update,
} from "@/repositories/notice-repository";
import type { CreateNoticeInput, NoticeStatus } from "@/types";

export const noticesRouter = Router();

const statuses = new Set<NoticeStatus>(["published", "draft"]);

function isNoticeStatus(value: unknown): value is NoticeStatus {
  return typeof value === "string" && statuses.has(value as NoticeStatus);
}

function valid(body: Record<string, unknown>): string {
  const { title, content, author, status } = body;
  if (typeof title !== "string" || !title.trim()) return "标题不能为空";
  if (typeof content !== "string" || !content.trim()) return "正文不能为空";
  if (typeof author !== "string" || !author.trim()) return "作者不能为空";
  if (!isNoticeStatus(status)) return "状态只能是 published 或 draft";
  return "";
}

noticesRouter.get("/", (request, response) => {
  response.json(findAll(queryText(request.query.keyword)));
});

noticesRouter.get("/:id", (request, response) => {
  const item = findById(request.params.id);
  item
    ? response.json(item)
    : response.status(404).json({ message: "公告不存在" });
});

noticesRouter.post("/", (request, response) => {
  const body = request.body as Record<string, unknown>;
  const message = valid(body);
  if (message) {
    response.status(400).json({ message });
    return;
  }

  const payload: CreateNoticeInput = {
    title: String(body.title),
    content: String(body.content),
    author: String(body.author),
    status: body.status as NoticeStatus,
  };
  const item = create(payload);
  writeLog({
    actorName: request.user.name,
    module: "公告",
    action: "新增",
    detail: item.title,
  });
  response.status(201).json(item);
});

noticesRouter.put("/:id", (request, response) => {
  const body = request.body as Record<string, unknown>;
  const message = valid(body);
  if (message) {
    response.status(400).json({ message });
    return;
  }

  const payload: CreateNoticeInput = {
    title: String(body.title),
    content: String(body.content),
    author: String(body.author),
    status: body.status as NoticeStatus,
  };
  const item = update(request.params.id, payload);
  if (!item) {
    response.status(404).json({ message: "公告不存在" });
    return;
  }

  writeLog({
    actorName: request.user.name,
    module: "公告",
    action: "修改",
    detail: item.title,
  });
  response.json(item);
});

noticesRouter.delete("/:id", (request, response) => {
  const current = findById(request.params.id);
  if (!current) {
    response.status(404).json({ message: "公告不存在" });
    return;
  }

  remove(request.params.id);
  writeLog({
    actorName: request.user.name,
    module: "公告",
    action: "删除",
    detail: current.title,
  });
  response.status(204).end();
});
