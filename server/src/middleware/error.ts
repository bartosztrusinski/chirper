import { NextFunction, Request, Response } from 'express';
import { ENVIRONMENT } from '../config/secrets';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    status: statusCode,
    stack: ENVIRONMENT === 'production' ? '🥞' : err.stack,
  });
};

export default errorHandler;
