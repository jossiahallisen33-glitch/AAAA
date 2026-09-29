/**
 * 新闻 Mock。status 为 published（已发布）或 draft（草稿）。
 */
import type { News } from "@/types";

export const mockNews: News[] = [
  {
    id: 1,
    title: "领课平台 2026 春季升级上线",
    content: "本期升级新增新闻动态模块，支持校园资讯发布与归档。",
    author: "系统管理员",
    status: "published",
    createdAt: "2026-03-02T08:00:00.000Z",
  },
  {
    id: 2,
    title: "教务处开展听课评课活动",
    content: "本周起各教研组互相听课，周五前提交评课表至教务处。",
    author: "李明",
    status: "published",
    createdAt: "2026-03-20T09:20:00.000Z",
  },
  {
    id: 3,
    title: "暑期研学营招募文案（草稿）",
    content: "文案还在改，先不要发到学员群。",
    author: "王芳",
    status: "draft",
    createdAt: "2026-04-05T14:10:00.000Z",
  },
];
