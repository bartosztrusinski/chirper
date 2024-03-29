import { model, Schema } from 'mongoose';
import { Follow, FollowModel } from './follow.interfaces';
import * as userService from '../users/user.service';

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

followSchema.pre('save', function (next) {
  this.$locals.wasNew = this.isNew;
  next();
});

followSchema.post('save', async function incrementMetrics() {
  if (this.$locals.wasNew) {
    await userService.incrementMetrics(this.sourceUser, 'followedCount');
    await userService.incrementMetrics(this.targetUser, 'followingCount');
  }
});

followSchema.post('remove', async function decrementMetrics() {
  await userService.decrementMetrics(this.sourceUser, 'followedCount');
  await userService.decrementMetrics(this.targetUser, 'followingCount');
});

const Follow = model<Follow>('Follow', followSchema);

export default Follow;
