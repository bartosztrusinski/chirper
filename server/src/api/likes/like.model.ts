import { model, Schema } from 'mongoose';
import * as ChirpService from '../chirps/chirp.service';
import * as UserService from '../users/user.service';
import { LikeModel, Like } from './like.interfaces';

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

likeSchema.post('save', async function incrementMetrics() {
  if (!this.isNew) return;
  await ChirpService.incrementMetrics(this.chirp, 'likeCount');
  await UserService.incrementMetrics(this.user, 'likedChirpCount');
});

likeSchema.post('remove', async function decrementMetrics() {
  await ChirpService.decrementMetrics(this.chirp, 'likeCount');
  await UserService.decrementMetrics(this.user, 'likedChirpCount');
});

const Like = model<Like>('Like', likeSchema);

export default Like;
