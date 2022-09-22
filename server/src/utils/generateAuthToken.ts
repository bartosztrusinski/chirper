import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/general';

const generateAuthToken = (userId: Types.ObjectId) => {
  return jwt.sign({ currentUserId: userId }, config.jwt.secret, {
    expiresIn: '7d',
  });
};

export default generateAuthToken;
