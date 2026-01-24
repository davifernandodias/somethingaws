export class AppError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      code?: string;
    }
  ) {
    super(message);

    this.statusCode = options?.statusCode;
    this.code = options?.code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
