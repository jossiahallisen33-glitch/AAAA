/**
 * 新闻仓库：专门负责改 mockNews。
 */
import { mockNews } from "@/data/mock-news";
import type { CreateNewsInput, News, UpdateNewsInput } from "@/types";

let nextId = 1;
for (const news of mockNews) {
  if (news.id >= nextId) {
    nextId = news.id + 1;
  }
}

function copyNews(news: News): News {
  return { ...news };
}

function toNumber(id: string | number): number {
  return Number(id);
}

export function findAll(keyword = ""): News[] {
  const text = keyword.trim().toLowerCase();
  const result: News[] = [];

  for (const news of mockNews) {
    const inTitle = news.title.toLowerCase().includes(text);
    const inAuthor = news.author.toLowerCase().includes(text);
    if (!text || inTitle || inAuthor) {
      result.push(copyNews(news));
    }
  }

  result.sort((left, right) => right.id - left.id);
  return result;
}

export function findById(id: string | number): News | null {
  const numberId = toNumber(id);
  for (const news of mockNews) {
    if (news.id === numberId) {
      return copyNews(news);
    }
  }
  return null;
}

export function create(data: CreateNewsInput): News {
  const item: News = {
    id: nextId,
    title: data.title.trim(),
    content: data.content.trim(),
    author: data.author.trim(),
    status: data.status,
    createdAt: new Date().toISOString(),
  };
  nextId += 1;
  mockNews.push(item);
  return copyNews(item);
}

export function update(
  id: string | number,
  data: UpdateNewsInput,
): News | null {
  const numberId = toNumber(id);
  const index = mockNews.findIndex((news) => news.id === numberId);
  if (index === -1) {
    return null;
  }

  const oldItem = mockNews[index];
  mockNews[index] = {
    id: oldItem.id,
    createdAt: oldItem.createdAt,
    title: data.title.trim(),
    content: data.content.trim(),
    author: data.author.trim(),
    status: data.status,
  };
  return copyNews(mockNews[index]);
}

export function remove(id: string | number): boolean {
  const numberId = toNumber(id);
  const index = mockNews.findIndex((news) => news.id === numberId);
  if (index === -1) {
    return false;
  }
  mockNews.splice(index, 1);
  return true;
}

export function countNews(): number {
  return mockNews.length;
}
