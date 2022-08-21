import { Handler } from 'express';
import { Types } from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import { UnauthorizedError } from '../utils/errors';
import { JWT_SECRET } from '../config/secrets';

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
