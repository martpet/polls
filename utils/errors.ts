export class GoogleApiError extends Error {
  status: string;
  code: number;

  constructor(
    { status, message, code }: {
      status: string;
      message: string;
      code: number;
    },
  ) {
    super(message);
    this.name = "GoogleApiError";
    this.status = status;
    this.code = code;
  }
}
