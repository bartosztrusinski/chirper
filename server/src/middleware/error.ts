import { NextFunction, Request, Response } from 'express';
import config from '../config/general';
import ErrorResponse from '../types/ErrorResponse';
import parseError from '../utils/parseError';

const env = config.app.environment;

const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const stack = env === 'production' ? '🥞' : error.stack;
  const { message, statusCode } = parseError(error, res.statusCode);

  res.status(statusCode).json({
    message,
    stack,
  });
};

export default errorHandler;
