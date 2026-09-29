/**
 * 登录页：把用户名密码交给 POST /api/auth/login。
 */
import { request, setToken } from "./api.js";
import { errorMessage, mustElement } from "./dom.js";
import type { LoginResult } from "./types.js";

const form = mustElement<HTMLFormElement>("#login-form");
const errorBox = mustElement<HTMLParagraphElement>("#login-error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.hidden = true;
  try {
    const result = await request<LoginResult>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: mustElement<HTMLInputElement>("#username").value,
        password: mustElement<HTMLInputElement>("#password").value,
      }),
    });
    setToken(result.token);
    location.replace("/admin.html");
  } catch (error: unknown) {
    errorBox.textContent = errorMessage(error);
    errorBox.hidden = false;
  }
});
