import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import config from './config/env.config';
import * as UserService from './api/users/user.service';
import * as ChirpService from './api/chirps/chirp.service';
import { DeleteOne } from './api/users/user.interfaces';
import { ErrorResponse, RequestValidators, ChirpIdObject } from './interfaces';
import { parseAuthHeader, parseError } from './utils/helper.utils';

const env = config.app.environment;

const authenticate = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('authorization');

  res.status(401);

  const currentUserId = parseAuthHeader(authHeader);

  const currentUser = await UserService.findOne(currentUserId);

  req.currentUserId = currentUser._id;

  next();
};

const authenticateAllowGuest = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('authorization');

  res.status(401);

  try {
    const currentUserId = parseAuthHeader(authHeader);
    const currentUser = await UserService.findOne(currentUserId);

    req.currentUserId = currentUser._id;
  } catch (err) {
    return next();
  }

  next();
};

const authorize = async (
  req: Request<ChirpIdObject, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { chirpId } = req.params;

  const foundChirp = await ChirpService.findOne(chirpId, 'author');

  if (!foundChirp.author.equals(currentUserId)) {
    res.status(401);
    throw new Error(
      'Not authorized, you must be the author of the chirp to do that'
    );
  }

  next();
};

const passwordAuthenticate = async (
  req: Request<unknown, unknown, DeleteOne, unknown>,
  res: Response,
  next: NextFunction
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { password } = req.body;

  res.status(400);

  await UserService.confirmPassword(currentUserId, password);

  next();
};

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  throw new Error(`🔍️ - Sorry! Not Found ${req.originalUrl}`);
};

const validateRequest =
  (validators: RequestValidators) =>
  (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    if (validators.body) {
      req.body = validators.body.parse(req.body);
    }
    if (validators.params) {
      req.params = validators.params.parse(req.params);
    }
    if (validators.query) {
      req.query = validators.query.parse(req.query);
    }
    if (validators.currentUserId) {
      req.currentUserId = validators.currentUserId.parse(req.currentUserId);
    }
    next();
  };

export {
  authenticate,
  authenticateAllowGuest,
  authorize,
  errorHandler,
  notFound,
  passwordAuthenticate,
  validateRequest,
};
