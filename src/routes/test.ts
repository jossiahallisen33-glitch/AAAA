import { Router } from "express";
import { queryText } from "@/query";
import { writeLog} from "@/repositories/log-repository";
import {create,findAll} from "@/repositories/course-repository";


export const coursesRouter = Router();

const statuses = new Set<CourseStatus>(["open", "closed"]);

function isCourseStatus(value: unknown): value is CourseStatus {
  return typeof value === "string" && statuses.has(value as CourseStatus);
}
