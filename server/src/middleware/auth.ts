import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import * as UserService from '../services/user';
import * as ChirpService from '../services/chirp';
import parseAuthHeader from '../utils/parseAuthHeader';
import { DeleteOne } from '../types/user';
import { ChirpIdObject } from '../types/request';

export const authenticate = async (
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

export const authenticateAllowGuest = async (
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

export const authorize = async (
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

export const passwordAuthenticate = async (
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
