import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ENVIRONMENT } from '../config/secrets';

interface MessageResponse {
  message: string;
}
interface ErrorResponse extends MessageResponse {
  stack?: string;
}

class ErrorParser {
  public static parse(error: Error, statusCode: number) {
    if (error instanceof ZodError) {
      return this.parseZodError(error);
    }
    return this.parseError(error, statusCode);
  }

  private static parseZodError(error: ZodError) {
    return {
      message: error.issues.map((issue) => issue.message).join(', '),
      statusCode: 422,
    };
  }
  private static parseError(error: Error, statusCode: number) {
    return {
      message: error.message,
      statusCode: statusCode === 200 ? 500 : statusCode,
    };
  }
}

const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const stack = ENVIRONMENT === 'production' ? '🥞' : error.stack;
  const { message, statusCode } = ErrorParser.parse(error, res.statusCode);

  res.status(statusCode).json({
    message,
    stack,
  });
};

export default errorHandler;
