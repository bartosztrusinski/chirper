import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET } from '../config/secrets';
import Chirp from '../models/Chirp';
import { ChirpId } from '../schemas';

interface AuthPayload extends JwtPayload {
  currentUserId: Types.ObjectId;
}

export const isAuthenticated = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('authorization');

  if (!authHeader) {
    res.status(401);
    throw new Error('Not authorized, no authorization header provided');
  }

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, invalid authorization header');
  }

  const authToken = authHeader.split(' ')[1];

  const { currentUserId } = jwt.verify(authToken, JWT_SECRET) as AuthPayload;

  const currentUser = await User.exists({ _id: currentUserId });
  if (!currentUser) {
    res.status(401);
    throw new Error(
      'Not authorized, user with given authorization token not found'
    );
  }

  req.currentUserId = currentUser._id;

  next();
};

export const isChirpAuthor = async (
  req: Request<ChirpId, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
) => {
  const { currentUserId } = req;
  const { chirpId } = req.params;

  if (!currentUserId) {
    res.status(401);
    throw new Error('Not authorized, you must be logged in to do that');
  }

  const foundChirp = await Chirp.findById(chirpId).select('author');
  if (!foundChirp) {
    res.status(400);
    throw new Error('Sorry, we could not find that chirp');
  }
  if (!foundChirp.author.equals(currentUserId)) {
    res.status(401);
    throw new Error(
      'Not authorized, you must be the author of the chirp to do that'
    );
  }

  next();
};

export const confirmPassword = async (
  req: Request<unknown, unknown, { password: string }, unknown>,
  res: Response,
  next: NextFunction
) => {
  const { currentUserId } = req;
  const { password } = req.body;

  const currentUser = await User.findById(currentUserId).select('password');
  if (!currentUser) {
    res.status(400);
    throw new Error('Sorry, we could not find your account');
  }

  const isPasswordMatch = await currentUser.isPasswordMatch(password);
  if (!isPasswordMatch) {
    res.status(400);
    throw new Error('Sorry, wrong password!');
  }

  next();
};
