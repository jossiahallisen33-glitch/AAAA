export function mustElement<T extends HTMLElement>(selector: string): T {
  const node = document.querySelector(selector);
  if (!(node instanceof HTMLElement)) {
    throw new Error(`找不到元素 ${selector}`);
  }
  return node as T;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "操作失败";
}

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string | number): string {
  return String(value).replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char);
}
