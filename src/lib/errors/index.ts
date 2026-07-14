export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ForbiddenError extends AppError {
  constructor(code = "FORBIDDEN", message = "Akses ditolak.") {
    super(code, message);
  }
}
