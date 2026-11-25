/** Error with an HTTP status and a machine-readable code the frontend can switch on. */
export class AppError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}
