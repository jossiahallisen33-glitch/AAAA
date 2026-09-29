# 项目演练：用 TypeScript 改造领课后台

这是 TypeScript 五天课程的最后一课。业务不再另起一个库存系统。学生在 NodeJS 第 19 课已经做过产品 **领课**（培训机构教务后台）：登录、菜单、用户、课程、公告、操作日志。本课把同一套项目从 JavaScript 改成 TypeScript，服务端继续用 Express，数据仍然是内存 MOCK。

## 学习目标

学完本课，能够：

1. 说清：页面和接口还是领课，变的是类型、模块和编译，不是业务。
2. 用接口和 `Omit` 区分「库里的用户」和「回给浏览器的用户」（没有密码）。
3. 用字面量联合、`Set` 和类型守卫校验角色、状态这类固定选项。
4. 给 Express 请求补上 `request.user`，给 `fetch` 写成泛型 `request<T>`。
5. 分两份 `tsconfig`：一份编 Node 服务，一份编浏览器脚本；先 `tsc` 再启动。

## 主题的意义

NodeJS 课已经能把领课跑起来。类型课如果再做一个陌生的库存 Demo，学生要把精力花在新业务上，学过的接口、泛型、模块反而用不上。

领课的页面他们认识，接口路径他们认识。本课要练的是：同样一份 MOCK 数组，同样一套 REST，代码在编译期就把「密码会不会漏出去」「状态是不是写错」拦住。

数据不接数据库。重启服务后 MOCK 恢复，Token 失效，需要重新登录。这和 NodeJS 第 19 课一样。

## 本课怎么走

1. 对照 NodeJS 第 19 课的目录，认出 `src`、`public`、仓库和路由。
2. 先看 `src/types.ts`：实体、请求体、`User = Omit<UserRecord, "password">`。
3. 服务端按类型重写仓库和路由，校验处用类型守卫。
4. 浏览器脚本从 `public/js/*.js` 改到 `client/*.ts`，编译进 `public/js`。
5. `npm start` 打开领课，走一遍登录和增删改，确认行为和原来一致。

## 运行项目

进入本课目录后执行：

```bash
npm install
npm start
```

打开：

```text
http://localhost:3000
```

账号：`admin` / `123456`。

`npm start` 会先编译服务端到 `dist/`、前端到 `public/js/`，再执行 `node dist/app.js`。改了 `.ts` 文件后重新执行 `npm start`。

只检查类型、不启动服务：

```bash
npx tsc -p tsconfig.server.json --noEmit
npx tsc -p tsconfig.client.json --noEmit
```

## 项目结构

```text
lesson-26-项目演练-TypeScript改造领课后台/
├─ package.json
├─ tsconfig.server.json
├─ tsconfig.client.json
├─ src/                         服务端 TypeScript（编译到 dist/）
│  ├─ app.ts
│  ├─ types.ts
│  ├─ http-error.ts
│  ├─ paths.ts
│  ├─ save-cover.ts
│  ├─ query.ts
│  ├─ express.d.ts
│  ├─ data/
│  ├─ repositories/
│  ├─ stores/
│  ├─ middleware/
│  └─ routes/
├─ client/                      浏览器 TypeScript（编译到 public/js/）
│  ├─ types.ts
│  ├─ api.ts
│  ├─ dom.ts
│  ├─ login.ts
│  └─ admin.ts
└─ public/                      HTML / CSS / 封面图（页面结构与 NodeJS 课相同）
   ├─ index.html
   ├─ login.html
   ├─ admin.html
   ├─ css/admin.css
   └─ uploads/covers/
```

`package.json` 里 `"type": "module"`。运行时依赖仍是 `express`，开发依赖加上 `typescript`、`@types/node`、`@types/express`。

## 两份 tsconfig

服务端要给 Node 用，模块解析走 `NodeNext`，输出在 `dist/`。源码里的导入写成 `.js` 后缀（Node 在运行编译后的文件时要靠这个后缀找到邻居文件）：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true
  },
  "include": ["src/**/*.ts"]
}
```

浏览器脚本不能和 Node 的 `fs`、`path` 编在一起。前端用 DOM 类型，输出到 `public/js/`，HTML 仍然写 `/js/admin.js`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"],
    "rootDir": "client",
    "outDir": "public/js",
    "strict": true
  },
  "include": ["client/**/*.ts"]
}
```

## 类型：库里有密码，接口里没有

`UserRecord` 是 MOCK 数组里的完整账号。页面和大多数接口只该看见 `User`。`Omit` 从记录类型里拿掉 `password`，改字段时两处一起变：

```ts
export type UserRole = "admin" | "teacher";
export type UserStatus = "active" | "disabled";

export interface UserRecord {
  id: number;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  email: string;
  createdAt: string;
}

export type User = Omit<UserRecord, "password">;
```

新增用户必须带密码；修改时密码可空。`UpdateUserInput` 用 `Omit` 再补一个可选密码：

```ts
export type UpdateUserInput = Omit<CreateUserInput, "username" | "password"> & {
  password?: string;
};
```

仓库里用解构去掉密码再返回。`password` 变量加上下划线前缀，表示故意不用：

```ts
function withoutPassword(user: UserRecord): User {
  const { password: _password, ...safe } = user;
  return safe;
}
```

登录要用原对象比密码，所以 `findByUsername` 返回 `UserRecord | null`，不是 `User`。

## 给 Express 补上当前用户

JavaScript 里可以随手写 `request.user`。TypeScript 默认的 `Request` 没有这个字段。用声明合并加上去：

```ts
import type { User } from "./types.js";

declare global {
  namespace Express {
    interface Request {
      user: User;
      token: string;
    }
  }
}

export {};
```

`requireAuth` 通过之后，后面的路由就可以写 `request.user.name`，编译器知道这是 `User`。

## 校验：联合类型 + 类型守卫

角色、课程状态、公告状态都是固定几个字符串。先做成 `Set`，再用 `value is UserRole` 缩小类型：

```ts
const roles = new Set<UserRole>(["admin", "teacher"]);

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && roles.has(value as UserRole);
}
```

`request.body` 在运行时是 `unknown` 形状的 JSON。守卫通过之后，才能放进 `CreateUserInput` 交给仓库。查询参数同样可能是数组或对象，课堂接口只收字符串：

```ts
export function queryText(value: unknown): string {
  return typeof value === "string" ? value : "";
}
```

封面校验失败不要当成 500。`HttpError` 带 `status`，入口用 `instanceof` 判断：

```ts
export class HttpError extends Error {
  readonly status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
```

`save-cover.ts` 里 MIME 表用 `as const`，再用 `value is keyof typeof extensions` 判断是否支持这种图片。

## 浏览器：泛型请求和 DOM

`request` 做成泛型。调用方写 `request<User[]>`，拿到的就按用户数组用，不必再 `as`：

```ts
export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // 有 token 就加 Authorization
  // 204 没有正文，返回 undefined as T
  // 失败时 throw new Error(result.message)
}
```

`querySelector` 可能是 `null`。课堂里用 `mustElement<T>`：找不到就抛错，找到了就是具体元素类型。`catch` 的参数按规范写成 `unknown`，再用 `error instanceof Error` 取 `message`。

页面 HTML、CSS、封面图从 NodeJS 第 19 课原样沿用。学生打开后应看到同一套登录页和领课壳。

## 数据仍是 MOCK

| 资源 | 数组 | 说明 |
| --- | --- | --- |
| 用户 | `mockUsers` | 含明文密码，仅课堂演示 |
| 课程 | `mockCourses` | `cover` 是 `/uploads/covers/...` |
| 公告 | `mockNotices` | published / draft |
| 日志 | `mockLogs` | 只追加，不删除 |
| 菜单 | `menus` | 接口原样返回 |

仓库函数名与 NodeJS 课一致：`findAll`、`findById`、`create`、`update`、`remove`、`writeLog`。路由不直接 `push` / `splice`。

## 接口一览

和 NodeJS 第 19 课相同。除登录外都要带 `Authorization: Bearer …`。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/auth/login` | 登录，发 token |
| GET | `/api/auth/me` | 当前用户 |
| POST | `/api/auth/logout` | 退出，204 |
| GET | `/api/menus` | 侧栏菜单 |
| GET | `/api/dashboard` | 四个统计数字 |
| GET/POST/PUT/DELETE | `/api/users` | 用户 CRUD |
| GET/POST/PUT/DELETE | `/api/courses` | 课程 CRUD，新增必须带封面 |
| GET/POST/PUT/DELETE | `/api/notices` | 公告 CRUD |
| GET | `/api/logs` | 日志查询 |

## TypeScript 知识点对照

| 用法 | 出现位置 |
| --- | --- |
| interface / type | `src/types.ts`、`client/types.ts` |
| 字面量联合 | `UserRole`、`CourseStatus` |
| `Omit` / 交叉类型 | `User`、`UpdateUserInput` |
| `as const` | 封面 MIME 表 |
| 泛型 | `request<T>`、`Set<UserRole>`、`mustElement<T>` |
| 类型守卫 | `isUserRole`、`error instanceof Error` |
| 模块导入导出 | 全程；服务端导入写 `.js` |
| 类与继承 | `HttpError extends Error` |
| DOM 类型 | `HTMLFormElement`、`HTMLDialogElement` |
| Promise / async | 路由里存封面、页面里 `request` |
| `unknown` | 错误处理、`request.body` 校验 |
| 声明合并 | `src/express.d.ts` |
| 双项目编译 | `tsconfig.server.json`、`tsconfig.client.json` |

装饰器、单元测试、数据库、前端框架本课不用。

## 项目功能（与 NodeJS 课对齐）

1. 未登录不能调菜单、工作台和各业务接口。
2. 登录成功进入领课，顶栏显示当前用户，可以退出。
3. 菜单来自接口，当前项高亮。
4. 用户管理支持查询和完整 CRUD，响应不含密码。
5. 不能删除自己；用户名冲突返回 409。
6. 课程管理支持查询、卡片展示和完整 CRUD，新增必须上传封面。
7. 公告管理支持草稿/已发布和完整 CRUD。
8. 操作日志记录登录退出和业务写入，页面只能查询，不能删除。
9. 重启服务后 MOCK 恢复，需要重新登录。

## 课堂随练

不要另起项目，只改 `src/routes/users.ts`：

1. 新增用户时，用户名去掉空白后长度至少 3 个字符，否则 400。
2. 当前登录用户不能把自己的 `status` 改成 `disabled`，否则 400。

改完重新 `npm start`，用 `admin` 登录验证。参考：

```ts
// 1. 放在 valid() 里，requirePassword 为 true 时：
if (typeof username !== "string" || username.trim().length < 3) {
  return "用户名至少 3 个字符";
}

// 2. 放在 PUT 处理函数里，update 之前：
if (
  Number(request.params.id) === request.user.id &&
  body.status === "disabled"
) {
  response.status(400).json({ message: "不能停用当前登录账号" });
  return;
}
```

## 面试题

### 1. 为什么最后一课不新做库存系统，而改造领课？

**答案：** 领课的业务和接口学生已经会。收官课要练的是 TypeScript：给同一份 MOCK 和 REST 加上类型、模块和编译。换业务会把时间耗在需求上。见「主题的意义」。

### 2. `User` 和 `UserRecord` 为什么要拆开？

**答案：** 数组里必须有密码才能登录；列表和详情不能把密码回给浏览器。`Omit<UserRecord, "password">` 保证少一个字段时编译失败，而不是运行时才发现。见 `src/types.ts`、`withoutPassword`。

### 3. 服务端导入为什么写成 `from "./types.js"`？源文件明明是 `.ts`。

**答案：** `tsc` 不会改写导入路径。运行的是 `dist` 里的 `.js`。`module` 为 `NodeNext` 时，源码里就要写运行时那个后缀。见 `tsconfig.server.json`。

### 4. 为什么要两份 tsconfig，而不是一份编全部？

**答案：** Node 代码要用 `fs`、`path`、Express；浏览器代码要用 `document`、`fetch`。`lib` 和模块解析不一样，混在一起会互相污染。见「两份 tsconfig」。

### 5. `request<User[]>` 里的泛型解决什么问题？

**答案：** `fetch` 的 `response.json()` 是 `any`。调用处写明期望形状后，表格渲染才能安全用 `user.role`。见 `client/api.ts`。

### 6. `catch (error: unknown)` 为什么不能直接 `error.message`？

**答案：** `unknown` 必须先缩小。`error instanceof Error` 之后才有 `message`。这是类型守卫，不是多写一句。见 `client/dom.ts` 的 `errorMessage`。
