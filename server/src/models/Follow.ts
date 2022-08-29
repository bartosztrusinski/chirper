import { model, Model, Schema, Types } from 'mongoose';

interface IFollow {
  sourceUser: Types.ObjectId;
  targetUser: Types.ObjectId;
}

type FollowModel = Model<IFollow>;

const followSchema = new Schema<IFollow, FollowModel>({
  sourceUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Source user is required'],
  },
  targetUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Target user is required'],
  },
});

const Follow = model<IFollow>('Follow', followSchema);

export default Follow;
