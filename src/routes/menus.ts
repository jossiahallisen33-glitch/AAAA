/**
 * 左侧菜单由接口下发，页面按这份数据渲染。
 */
import { Router } from "express";
import { menus } from "@/data/menus";

export const menusRouter = Router();

menusRouter.get("/", (_request, response) => {
  response.json(menus);
});
