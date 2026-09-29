/**
 * 操作日志仓库。没有 remove：日志是证据，页面只许查询。
 */
import { mockLogs } from "@/data/mock-logs";
import type { OperationLog, WriteLogInput } from "@/types";

let nextId = 1;
for (const log of mockLogs) {
  if (log.id >= nextId) {
    nextId = log.id + 1;
  }
}

function copyLog(log: OperationLog): OperationLog {
  return { ...log };
}

export function findAll(keyword?: string, moduleName?: string): OperationLog[] {
  const text = (keyword ?? "").trim().toLowerCase();
  const moduleText = (moduleName ?? "").trim();
  const result: OperationLog[] = [];

  for (const log of mockLogs) {
    if (moduleText && log.module !== moduleText) {
      continue;
    }
    const inName = log.actorName.toLowerCase().includes(text);
    const inAction = log.action.toLowerCase().includes(text);
    const inDetail = log.detail.toLowerCase().includes(text);
    if (!text || inName || inAction || inDetail) {
      result.push(copyLog(log));
    }
  }

  result.sort((left, right) => right.id - left.id);
  return result;
}

export function writeLog(data: WriteLogInput): OperationLog {
  const item: OperationLog = {
    id: nextId,
    actorName: data.actorName,
    module: data.module,
    action: data.action,
    detail: data.detail,
    createdAt: new Date().toISOString(),
  };
  nextId += 1;
  mockLogs.push(item);
  return copyLog(item);
}

export function countLogs(): number {
  return mockLogs.length;
}
