import { model, Schema } from 'mongoose';
import * as UserService from '../services/user';
import { Follow, FollowModel } from '../types/follow';

const followSchema = new Schema<Follow, FollowModel>(
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

followSchema.index({ sourceUser: 1, targetUser: 1 }, { unique: true });

followSchema.post('save', async function incrementMetrics() {
  if (!this.isNew) return;
  await UserService.incrementMetrics(this.sourceUser, 'followingCount');
  await UserService.incrementMetrics(this.targetUser, 'followersCount');
});

followSchema.post('remove', async function decrementMetrics() {
  await UserService.decrementMetrics(this.sourceUser, 'followingCount');
  await UserService.decrementMetrics(this.targetUser, 'followersCount');
});

const Follow = model<Follow>('Follow', followSchema);

export default Follow;
