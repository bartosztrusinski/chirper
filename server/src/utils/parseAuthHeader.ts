import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config/general';
import { AuthPayload } from '../interfaces/general';

const parseAuthHeader = (authHeader: string | undefined) => {
  if (!authHeader) {
    throw new Error('Not authorized, no authorization header provided');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Not authorized, invalid authorization header');
  }

  const authToken = authHeader.split(' ')[1];

  const { currentUserId } = jwt.verify(
    authToken,
    config.jwt.secret
  ) as AuthPayload;

  return new Types.ObjectId(currentUserId);
};

export default parseAuthHeader;
