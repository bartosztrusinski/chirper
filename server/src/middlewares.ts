import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import rateLimit from 'express-rate-limit';
import { ErrorResponse, RequestValidators, ChirpIdObject } from './interfaces';
import { parseAuthHeader, parseError } from './utils/helper.utils';
import * as userService from './api/users/user.service';
import * as chirpService from './api/chirps/chirp.service';
import envConfig from './config/env.config';
import reqConfig from './config/request.config';

const env = envConfig.app.environment;

const authenticate = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('authorization');

  res.status(401);

  const currentUserId = parseAuthHeader(authHeader);

  const currentUser = await userService.findOne(currentUserId);

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
    const currentUser = await userService.findOne(currentUserId);

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

  const foundChirp = await chirpService.findOne(chirpId, 'author');

  if (!foundChirp.author.equals(currentUserId)) {
    res.status(401);
    throw new Error(
      'Not authorized, you must be the author of the chirp to do that'
    );
  }

  next();
};

const passwordAuthenticate = async (
  req: Request<unknown, unknown, { password: string }>,
  res: Response,
  next: NextFunction
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { password } = req.body;

  res.status(400);

  await userService.validateCredentials(currentUserId, password);

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
    const parsedReq = validators.parse({
      body: req.body,
      params: req.params,
      query: req.query,
      currentUserId: req.currentUserId,
    });

    req.body = parsedReq.body;
    req.params = parsedReq.params;
    req.query = parsedReq.query;
    req.currentUserId = parsedReq.currentUserId as Types.ObjectId;

    next();
  };

const rateLimiter = rateLimit({
  windowMs: 1000 * 60 * reqConfig.rate.timeFrameMinutes,
  max: reqConfig.rate.limit,
  standardHeaders: true,
  legacyHeaders: false,
});

export {
  authenticate,
  authenticateAllowGuest,
  authorize,
  errorHandler,
  notFound,
  passwordAuthenticate,
  validateRequest,
  rateLimiter,
};
