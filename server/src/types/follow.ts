import { Model, Types } from 'mongoose';

export interface Follow {
  sourceUser: Types.ObjectId;
  targetUser: Types.ObjectId;
}

export type FollowModel = Model<Follow>;
