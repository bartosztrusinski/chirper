import { Types } from 'mongoose';
import { JWT_SECRET } from '../config/secrets';
import jwt from 'jsonwebtoken';

const generateAuthToken = (userId: Types.ObjectId) => {
  return jwt.sign({ currentUserId: userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export default generateAuthToken;
