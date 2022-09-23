import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/general';

const generateAuthToken = (userId: Types.ObjectId) => {
  return jwt.sign({ currentUserId: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export default generateAuthToken;
