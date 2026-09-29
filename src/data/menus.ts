/**
 * 左侧菜单由接口下发，页面按这份数据渲染。
 */
import type { MenuItem } from "@/types";

export const menus: MenuItem[] = [
  { id: "dashboard", title: "工作台", path: "/dashboard", icon: "▣" },
  { id: "users", title: "用户管理", path: "/users", icon: "◎" },
  { id: "courses", title: "课程管理", path: "/courses", icon: "▤" },
  { id: "notices", title: "公告管理", path: "/notices", icon: "✉" },
  { id: "news", title: "新闻动态", path: "/news", icon: "📰" },
  { id: "logs", title: "操作日志", path: "/logs", icon: "☰" },
];
