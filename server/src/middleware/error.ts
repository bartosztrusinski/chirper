import { NextFunction, Request, Response } from 'express';
import { StatusCodeError } from '../utils/errors';

const errorHandler = (
  err: StatusCodeError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof StatusCodeError ? err.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    status: statusCode,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export default errorHandler;
