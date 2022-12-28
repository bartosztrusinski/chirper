import { model, Schema } from 'mongoose';
import { LikeModel, Like } from './like.interfaces';
import * as chirpService from '../chirps/chirp.service';
import * as userService from '../users/user.service';

const likeSchema = new Schema<Like, LikeModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Like user is required'],
    },
    chirp: {
      type: Schema.Types.ObjectId,
      ref: 'Chirp',
      required: [true, 'Like chirp is required'],
    },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, chirp: 1 }, { unique: true });

likeSchema.pre('save', function (next) {
  this.$locals.wasNew = this.isNew;
  next();
});

likeSchema.post('save', async function incrementMetrics() {
  if (this.$locals.wasNew) {
    await chirpService.incrementMetrics(this.chirp, 'likeCount');
    await userService.incrementMetrics(this.user, 'likedChirpCount');
  }
});

likeSchema.post('remove', async function decrementMetrics() {
  await chirpService.decrementMetrics(this.chirp, 'likeCount');
  await userService.decrementMetrics(this.user, 'likedChirpCount');
});

const Like = model<Like>('Like', likeSchema);

export default Like;
