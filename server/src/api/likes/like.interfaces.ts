import { Model, Types } from 'mongoose';
import * as LikeControllers from './like.controllers.interfaces';

interface Like {
  user: Types.ObjectId;
  chirp: Types.ObjectId;
}

type LikeModel = Model<Like>;

export { Like, LikeModel, LikeControllers };
