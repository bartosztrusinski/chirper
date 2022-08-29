import { model, Model, Schema, Types } from 'mongoose';

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

const Like = model<ILike>('Like', likeSchema);

export default Like;
