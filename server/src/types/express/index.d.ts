import { Types } from 'mongoose';

declare module 'express-serve-static-core' {
  export interface Request {
    currentUserId?: Types.ObjectId;
  }
}
