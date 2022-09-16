import { Schema, Types, model, Model, HydratedDocument } from 'mongoose';
import Like from './Like';
import User, { HydratedUser } from './User';

export interface IChirp {
  content: string;
  author: Types.ObjectId;
  replies: Types.ObjectId[];
  metrics: IChirpMetrics;
}

interface IChirpMetrics {
  likeCount: number;
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
    metrics: {
      likeCount: {
        type: Number,
        default: 0,
      },
    },
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

chirpSchema.post('save', async function incrementMetrics() {
  await User.findByIdAndUpdate(this.author, {
    $inc: { 'metrics.chirpCount': 1 },
  });
});

chirpSchema.post('remove', async function removeDependencies() {
  await User.findByIdAndUpdate(this.author, {
    $inc: { 'metrics.chirpCount': -1 },
  });

  const { replies } = await this.populate<PopulatedReplies>('replies');
  const likes = await Like.find({ chirp: this._id });
  await Promise.all([...likes, ...replies].map((doc) => doc.remove()));
});

chirpSchema.index({ content: 'text' });

const Chirp = model<IChirp, ChirpModel>('Chirp', chirpSchema);

export type IPost = IChirp;
type PostModel = Model<IPost>;
const postSchema = new Schema<IPost, PostModel>({});

const PostChirp = Chirp.discriminator<IPost, PostModel>(
  'Post',
  postSchema,
  'post'
);

export interface IReply extends IChirp {
  post: Types.ObjectId;
  parent: Types.ObjectId;
}

type ReplyModel = Model<IReply>;

const replySchema = new Schema<IReply, ReplyModel>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Reply post is required'],
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Chirp',
    required: [true, 'Reply parent is required'],
  },
});

replySchema.post('save', async function pushToParent() {
  await Chirp.findByIdAndUpdate(this.parent, {
    $push: { replies: this._id },
  });
});

replySchema.post('remove', async function pullFromParent() {
  await Chirp.findByIdAndUpdate(this.parent, {
    $pull: { replies: this._id },
  });
});

const ReplyChirp = Chirp.discriminator<IReply, ReplyModel>(
  'Reply',
  replySchema,
  'reply'
);

export default Chirp;
export { PostChirp, ReplyChirp };
