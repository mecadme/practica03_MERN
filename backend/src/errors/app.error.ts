export class AppError extends Error {
  constructor(
    public override readonly message: string,
    public readonly statusCode: number = 400,
    public readonly code: string = 'BAD_REQUEST',
    public readonly details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
