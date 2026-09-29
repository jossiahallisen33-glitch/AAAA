/**
 * 带 HTTP 状态码的错误。入口的错误中间件看见它就按 status 回给浏览器。
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export function isParseError(error: unknown): error is { type: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    (error as { type: unknown }).type === "entity.parse.failed"
  );
}
