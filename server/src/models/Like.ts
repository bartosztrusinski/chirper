import { model, Model, Schema, Types } from 'mongoose';
import { Chirp } from './Chirp';
import User from './User';

interface ILike {
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

likeSchema.pre('save', async function () {
  await Chirp.findByIdAndUpdate(this.chirp, {
    $inc: { likeCount: 1 },
  });
  await User.findByIdAndUpdate(this.user, {
    $inc: { likedChirpCount: 1 },
  });
});

likeSchema.pre('remove', async function () {
  await Chirp.findByIdAndUpdate(this.chirp, {
    $inc: { likeCount: -1 },
  });
  await User.findByIdAndUpdate(this.user, {
    $inc: { likedChirpCount: -1 },
  });
});

const Like = model<ILike>('Like', likeSchema);

export default Like;
