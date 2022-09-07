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

chirpSchema.index({ content: 'text' });

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

const removeFromParent = async (reply: HydratedReply) => {
  // await Chirp.findOneAndUpdate(
  //   {
  //     replies: { $elemMatch: { $eq: chirp._id } },
  //   },
  //   { $pull: { replies: chirp._id } }
  // );
  await Chirp.findByIdAndUpdate(reply.parent, {
    $pull: { replies: reply._id },
  });
};

chirpSchema.pre('save', async function () {
  await User.findByIdAndUpdate(this.author, {
    $inc: { chirpCount: 1 },
  });
});

chirpSchema.pre('remove', async function (next) {
  await User.findByIdAndUpdate(this.author, {
    $inc: { chirpCount: -1 },
  });
  await removeReplies(this);
  if (this instanceof ReplyChirp) {
    await removeFromParent(this);
  }
  await Like.deleteMany({ chirp: this._id });
  next();
});

const Chirp = model<IChirp, ChirpModel>('Chirp', chirpSchema);

export type IPost = IChirp;
type PostModel = Model<IPost>;

const PostChirp = Chirp.discriminator<IPost, PostModel>(
  'Post',
  new Schema({}),
  'post'
);

export interface IReply extends IChirp {
  post: Types.ObjectId;
  parent: Types.ObjectId;
}
type ReplyModel = Model<IReply>;

const ReplyChirp = Chirp.discriminator<IReply, ReplyModel>(
  'Reply',
  new Schema({
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
  }),
  'reply'
);

export { Chirp, PostChirp, ReplyChirp };
