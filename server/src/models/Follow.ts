import { model, Model, Schema, Types } from 'mongoose';
import User from './User';

export interface IFollow {
  sourceUser: Types.ObjectId;
  targetUser: Types.ObjectId;
}

type FollowModel = Model<IFollow>;

const followSchema = new Schema<IFollow, FollowModel>(
  {
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
  },
  { timestamps: true }
);

followSchema.pre('save', async function () {
  await User.findByIdAndUpdate(this.sourceUser, {
    $inc: { followingCount: 1 },
  });
  await User.findByIdAndUpdate(this.targetUser, {
    $inc: { followersCount: 1 },
  });
});

followSchema.pre('remove', async function () {
  await User.findByIdAndUpdate(this.sourceUser, {
    $inc: { followingCount: -1 },
  });
  await User.findByIdAndUpdate(this.targetUser, {
    $inc: { followersCount: -1 },
  });
});

const Follow = model<IFollow>('Follow', followSchema);

export default Follow;
