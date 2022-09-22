import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { JWT_SECRET } from '../config/secrets';

interface AuthPayload extends JwtPayload {
  currentUserId: string;
}

const parseAuthHeader = (authHeader: string | undefined) => {
  if (!authHeader) {
    throw new Error('Not authorized, no authorization header provided');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Not authorized, invalid authorization header');
  }

  const authToken = authHeader.split(' ')[1];

  const { currentUserId } = jwt.verify(authToken, JWT_SECRET) as AuthPayload;

  return new Types.ObjectId(currentUserId);
};

export default parseAuthHeader;
