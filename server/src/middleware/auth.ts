import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import mongoose from 'mongoose';
import { JWT_SECRET } from '../utils/secrets';
// import { HydratedDocument } from 'mongoose';

interface AuthRequest extends Request {
  user?: IUser;
}

interface AuthPayload extends JwtPayload {
  id: mongoose.Types.ObjectId;
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
  const authJwt = authHeader.split(' ')[1];

  //verify token ✅
  const decodedAuthJwt = jwt.verify(authJwt, JWT_SECRET) as AuthPayload;

  //find user by id ✅
  //pass user in request object ✅
  const loggedInUser = await User.findById(decodedAuthJwt.id).select(
    '-password'
  );

  //check if user is found ✅
  if (!loggedInUser) {
    throw new UnauthorizedError(
      'Not authorized, user with given authorization token not found'
    );
  }

  //pass user in request object ✅
  req.user = loggedInUser;

  next();
};
