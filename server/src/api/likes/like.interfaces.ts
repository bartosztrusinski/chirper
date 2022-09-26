import { Model, Types } from 'mongoose';

export interface Like {
  user: Types.ObjectId;
  chirp: Types.ObjectId;
}

export type LikeModel = Model<Like>;
