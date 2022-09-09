import { model, Model, Schema, Types } from 'mongoose';
import { Chirp } from './Chirp';
import User from './User';

export interface ILike {
  user: Types.ObjectId;
  chirp: Types.ObjectId;
}

type LikeModel = Model<ILike>;

const likeSchema = new Schema<ILike, LikeModel>(
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

likeSchema.post('save', async function incrementMetrics() {
  await Chirp.findByIdAndUpdate(this.chirp, {
    $inc: { 'metrics.likeCount': 1 },
  });
  await User.findByIdAndUpdate(this.user, {
    $inc: { 'metrics.likedChirpCount': 1 },
  });
});

likeSchema.post('remove', async function decrementMetrics() {
  await Chirp.findByIdAndUpdate(this.chirp, {
    $inc: { 'metrics.likeCount': -1 },
  });
  await User.findByIdAndUpdate(this.user, {
    $inc: { 'metrics.likedChirpCount': -1 },
  });
});

likeSchema.index({ user: 1, chirp: 1 }, { unique: true });

const Like = model<ILike>('Like', likeSchema);

export default Like;
