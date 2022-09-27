import { Model, Types } from 'mongoose';
import * as FollowControllers from './follow.controllers.interfaces';

interface Follow {
  sourceUser: Types.ObjectId;
  targetUser: Types.ObjectId;
}

type FollowModel = Model<Follow>;

export { Follow, FollowModel, FollowControllers };
