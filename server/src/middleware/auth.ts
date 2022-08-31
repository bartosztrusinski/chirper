import { Handler } from 'express';
import { Types } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { JWT_SECRET } from '../config/secrets';
import { Chirp } from '../models/Chirp';

interface AuthPayload extends JwtPayload {
  currentUserId: Types.ObjectId;
}

export const isAuthenticated: Handler = async (req, res, next) => {
  //get auth header ✅
  const authHeader = req.header('authorization');

  //check if header is present ✅
  if (!authHeader) {
    throw new UnauthorizedError(
      'Not authorized, no authorization header provided'
    );
  }

  //check if header is valid ✅
  if (!authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Not authorized, invalid authorization header');
  }

  //get token from header ✅
  const authToken = authHeader.split(' ')[1];

  //verify token ✅
  const { currentUserId } = jwt.verify(authToken, JWT_SECRET) as AuthPayload;

  //check if user is found in db ✅
  const currentUser = await User.exists({ _id: currentUserId });
  if (!currentUser) {
    throw new UnauthorizedError(
      'Not authorized, user with given authorization token not found'
    );
  }

  //pass user in request object ✅
  req.currentUserId = currentUser._id;

  next();
};

export const isChirpAuthor: Handler = async (req, res, next) => {
  const { currentUserId } = req;
  const { chirpId } = req.params;

  if (!currentUserId) {
    throw new UnauthorizedError(
      'Not authorized, you must be logged in to do that'
    );
  }

  const foundChirp = await Chirp.findById(chirpId);
  if (!foundChirp) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  if (!foundChirp.author.equals(currentUserId)) {
    throw new UnauthorizedError(
      'Not authorized, you must be the author of the chirp to do that'
    );
  }

  next();
};

export const confirmPassword: Handler = async (req, res, next) => {
  const { currentUserId } = req;
  const { password } = req.body;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const isPasswordMatch = await currentUser.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new BadRequestError('Sorry, wrong password!');
  }

  next();
};
