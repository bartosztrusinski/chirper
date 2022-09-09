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

followSchema.post('save', async function incrementMetrics() {
  await User.findByIdAndUpdate(this.sourceUser, {
    $inc: { 'metrics.followingCount': 1 },
  });
  await User.findByIdAndUpdate(this.targetUser, {
    $inc: { 'metrics.followersCount': 1 },
  });
});

followSchema.post('remove', async function decrementMetrics() {
  await User.findByIdAndUpdate(this.sourceUser, {
    $inc: { 'metrics.followingCount': -1 },
  });
  await User.findByIdAndUpdate(this.targetUser, {
    $inc: { 'metrics.followersCount': -1 },
  });
});

followSchema.index({ sourceUser: 1, targetUser: 1 }, { unique: true });

const Follow = model<IFollow>('Follow', followSchema);

export default Follow;
