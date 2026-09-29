/**
 * 操作日志只有查询。
 */
import { Router } from "express";
import { queryText } from "@/query";
import { findAll } from "@/repositories/log-repository";

export const logsRouter = Router();

logsRouter.get("/", (request, response) => {
  const keyword = queryText(request.query.keyword);
  const moduleName = queryText(request.query.module);
  response.json(findAll(keyword, moduleName));
});
