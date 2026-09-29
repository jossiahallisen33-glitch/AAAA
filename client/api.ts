/**
 * 浏览器调接口的小工具。
 * token 放在 sessionStorage：关标签页就没了，刷新还在。
 */
const TOKEN_KEY = "lingke-token";

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

interface ErrorBody {
  message?: string;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, { ...options, headers });
  if (response.status === 401 && path !== "/api/auth/login") {
    clearToken();
    location.replace("/login.html");
    throw new Error("请先登录");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const result = (await response.json()) as ErrorBody;
  if (!response.ok) {
    throw new Error(result.message || "请求失败");
  }
  return result as T;
}
