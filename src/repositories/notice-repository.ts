/**
 * 公告仓库：专门负责改 mockNotices。
 */
import { mockNotices } from "@/data/mock-notices";
import type { CreateNoticeInput, Notice, UpdateNoticeInput } from "@/types";

let nextId = 1;
for (const notice of mockNotices) {
  if (notice.id >= nextId) {
    nextId = notice.id + 1;
  }
}

function copyNotice(notice: Notice): Notice {
  return { ...notice };
}

function toNumber(id: string | number): number {
  return Number(id);
}

export function findAll(keyword = ""): Notice[] {
  const text = keyword.trim().toLowerCase();
  const result: Notice[] = [];

  for (const notice of mockNotices) {
    const inTitle = notice.title.toLowerCase().includes(text);
    const inAuthor = notice.author.toLowerCase().includes(text);
    if (!text || inTitle || inAuthor) {
      result.push(copyNotice(notice));
    }
  }

  result.sort((left, right) => right.id - left.id);
  return result;
}

export function findById(id: string | number): Notice | null {
  const numberId = toNumber(id);
  for (const notice of mockNotices) {
    if (notice.id === numberId) {
      return copyNotice(notice);
    }
  }
  return null;
}

export function create(data: CreateNoticeInput): Notice {
  const item: Notice = {
    id: nextId,
    title: data.title.trim(),
    content: data.content.trim(),
    author: data.author.trim(),
    status: data.status,
    createdAt: new Date().toISOString(),
  };
  nextId += 1;
  mockNotices.push(item);
  return copyNotice(item);
}

export function update(
  id: string | number,
  data: UpdateNoticeInput,
): Notice | null {
  const numberId = toNumber(id);
  const index = mockNotices.findIndex((notice) => notice.id === numberId);
  if (index === -1) {
    return null;
  }

  const oldItem = mockNotices[index];
  mockNotices[index] = {
    id: oldItem.id,
    createdAt: oldItem.createdAt,
    title: data.title.trim(),
    content: data.content.trim(),
    author: data.author.trim(),
    status: data.status,
  };
  return copyNotice(mockNotices[index]);
}

export function remove(id: string | number): boolean {
  const numberId = toNumber(id);
  const index = mockNotices.findIndex((notice) => notice.id === numberId);
  if (index === -1) {
    return false;
  }
  mockNotices.splice(index, 1);
  return true;
}

export function countNotices(): number {
  return mockNotices.length;
}
