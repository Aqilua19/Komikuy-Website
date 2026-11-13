export type DonghuaErrorCode =
  | "CLOUDFLARE_BLOCKED"
  | "UPSTREAM_ERROR"
  | "NOT_FOUND"
  | "PARSE_ERROR"
  | "TIMEOUT"
  | "BAD_REQUEST"
  | "CONFIG_ERROR";

export class DonghuaError extends Error {
  code: DonghuaErrorCode;
  status: number;

  constructor(code: DonghuaErrorCode, message: string, status: number) {
    super(message);
    this.name = "DonghuaError";
    this.code = code;
    this.status = status;
  }
}
