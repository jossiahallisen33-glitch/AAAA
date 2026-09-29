/**
 * 登录态记在进程内存的 Map 里。服务重启后要重新登录。
 */
import type { Session } from "@/types";

const sessions = new Map<string, Session>();

export function createSession(userId: number): string {
  const token = crypto.randomUUID();
  sessions.set(token, { userId, createdAt: Date.now() });
  return token;
}

export function findSession(token: string): Session | null {
  return sessions.get(token) ?? null;
}

export function removeSession(token: string): boolean {
  return sessions.delete(token);
}
