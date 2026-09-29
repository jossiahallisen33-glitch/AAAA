/**
 * Express 的 query 可能是字符串、数组或对象。课堂接口只收普通字符串。
 */
export function queryText(value: unknown): string {
  return typeof value === "string" ? value : "";
}
