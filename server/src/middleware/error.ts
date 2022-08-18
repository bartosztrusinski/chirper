import { NextFunction, Request, Response } from 'express';
import { StatusCodeError } from '../utils/errors';
import { ENVIRONMENT } from '../utils/secrets';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = err instanceof StatusCodeError ? err.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    status: statusCode,
    stack: ENVIRONMENT === 'production' ? '🥞' : err.stack,
  });
};

export default errorHandler;
