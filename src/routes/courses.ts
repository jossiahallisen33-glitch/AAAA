/**
 * 课程接口。封面走 JSON 里的 coverData，由 saveCover 写成文件。
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
} from "@/repositories/course-repository";
import { saveCover } from "@/save-cover";
import type { CourseStatus, CreateCourseInput, UpdateCourseInput } from "@/types";

export const coursesRouter = Router();

const statuses = new Set<CourseStatus>(["open", "closed"]);

function isCourseStatus(value: unknown): value is CourseStatus {
  return typeof value === "string" && statuses.has(value as CourseStatus);
}

function valid(
  body: Record<string, unknown>,
  options: { requireCover: boolean },
): string {
  const title = body.title;
  const summary = body.summary;
  const teacher = body.teacher;
  const hours = Number(body.hours);
  const status = body.status;

  if (typeof title !== "string" || !title.trim()) return "课程名称不能为空";
  if (typeof summary !== "string" || !summary.trim()) return "课程简介不能为空";
  if (typeof teacher !== "string" || !teacher.trim()) return "授课教师不能为空";
  if (!Number.isInteger(hours) || hours <= 0) return "课时必须是正整数";
  if (!isCourseStatus(status)) return "状态只能是 open 或 closed";
  if (options.requireCover) return "请上传封面图";
  return "";
}

coursesRouter.get("/", (request, response) => {
  response.json(findAll(queryText(request.query.keyword)));
});

coursesRouter.get("/:id", (request, response) => {
  const item = findById(request.params.id);
  item
    ? response.json(item)
    : response.status(404).json({ message: "课程不存在" });
});

coursesRouter.post("/", async (request, response, next) => {
  const body = request.body as Record<string, unknown>;
  const message = valid(body, { requireCover: !body.coverData });
  if (message) {
    response.status(400).json({ message });
    return;
  }

  try {
    const cover = await saveCover(body.coverData);
    const payload: CreateCourseInput = {
      title: String(body.title),
      summary: String(body.summary),
      teacher: String(body.teacher),
      hours: Number(body.hours),
      status: body.status as CourseStatus,
      cover,
    };
    const item = create(payload);
    writeLog({
      actorName: request.user.name,
      module: "课程",
      action: "新增",
      detail: item.title,
    });
    response.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

coursesRouter.put("/:id", async (request, response, next) => {
  const body = request.body as Record<string, unknown>;
  const message = valid(body, { requireCover: false });
  if (message) {
    response.status(400).json({ message });
    return;
  }

  try {
    const cover = await saveCover(body.coverData);
    const payload: UpdateCourseInput = {
      title: String(body.title),
      summary: String(body.summary),
      teacher: String(body.teacher),
      hours: Number(body.hours),
      status: body.status as CourseStatus,
      cover,
    };
    const item = update(request.params.id, payload);
    if (!item) {
      response.status(404).json({ message: "课程不存在" });
      return;
    }

    writeLog({
      actorName: request.user.name,
      module: "课程",
      action: "修改",
      detail: item.title,
    });
    response.json(item);
  } catch (error) {
    next(error);
  }
});

coursesRouter.delete("/:id", (request, response) => {
  const current = findById(request.params.id);
  if (!current) {
    response.status(404).json({ message: "课程不存在" });
    return;
  }

  remove(request.params.id);
  writeLog({
    actorName: request.user.name,
    module: "课程",
    action: "删除",
    detail: current.title,
  });
  response.status(204).end();
});
