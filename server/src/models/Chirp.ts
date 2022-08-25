import { Schema, Types, model, Model, HydratedDocument } from 'mongoose';
import { HydratedUser } from './User';

interface IChirp {
  content: string;
  author: Types.ObjectId;
  replies: Types.ObjectId[];
  likes?: number; //temporary
}

type ChirpModel = Model<IChirp>;

const chirpSchema = new Schema<IChirp, ChirpModel>(
  {
    content: {
      type: String,
      required: [true, 'Chirp content is required'],
      maxLength: [140, 'Chirp must be less than 140 characters'],
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Chirp author is required'],
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reply',
      },
    ],
  },
  { timestamps: true, discriminatorKey: 'kind' }
);

export type HydratedChirp = HydratedDocument<IChirp>;
export type HydratedReply = HydratedDocument<IReply>;
export interface PopulatedReplies {
  replies: HydratedReply[];
}

export interface PopulatedAuthor {
  author: HydratedUser;
}

const removeReplies = async (chirp: HydratedChirp) => {
  const { replies } = await chirp.populate<PopulatedReplies>('replies');
  await Promise.all(replies.map((reply) => reply.remove()));
};

const removeFromParent = async (chirp: HydratedChirp) => {
  await Chirp.findOneAndUpdate(
    {
      replies: { $elemMatch: { $eq: chirp._id } },
    },
    { $pull: { replies: chirp._id } }
  );
};

chirpSchema.pre('remove', async function (next) {
  await removeReplies(this);
  await removeFromParent(this);
  next();
});

const Chirp = model<IChirp, ChirpModel>('Chirp', chirpSchema);

export type IPost = IChirp;
type PostModel = Model<IPost>;

const PostChirp = Chirp.discriminator<IPost, PostModel>('Post', new Schema({}));

export interface IReply extends IChirp {
  post: Types.ObjectId;
}
type ReplyModel = Model<IReply>;

const ReplyChirp = Chirp.discriminator<IReply, ReplyModel>(
  'Reply',
  new Schema({
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  })
);

export { Chirp, PostChirp, ReplyChirp };
