import { Schema, model } from 'mongoose';
import * as UserService from '../services/user';
import * as ChirpService from '../services/chirp';
import * as LikeService from '../services/like';
import {
  ChirpModel,
  Chirp,
  Reply,
  ReplyModel,
  Post,
  PostModel,
} from '../types/chirp';

const chirpSchema = new Schema<Chirp, ChirpModel>(
  {
    content: {
      type: String,
      required: [true, 'Chirp content is required'],
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

const postSchema = new Schema<Post, PostModel>({});

const replySchema = new Schema<Reply, ReplyModel>({
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

chirpSchema.index({ content: 'text' });

chirpSchema.post('save', async function incrementMetrics() {
  if (!this.isNew) return;
  await UserService.incrementMetrics(this.author, 'chirpCount');
});

chirpSchema.post('remove', async function removeDependencies() {
  await UserService.decrementMetrics(this.author, 'chirpCount');
  await ChirpService.deleteMany({ _id: this.replies });
  await LikeService.deleteMany({ chirp: this._id });
});

replySchema.post('save', async function pushToParent() {
  if (!this.isNew) return;
  await ChirpService.pushReply(this.parent, this._id);
});

replySchema.post('remove', async function pullFromParent() {
  await ChirpService.pullReply(this.parent, this._id);
});

const Chirp = model<Chirp, ChirpModel>('Chirp', chirpSchema);

const ReplyChirp = Chirp.discriminator<Reply, ReplyModel>(
  'Reply',
  replySchema,
  'reply'
);

const PostChirp = Chirp.discriminator<Post, PostModel>(
  'Post',
  postSchema,
  'post'
);

export default Chirp;
export { PostChirp, ReplyChirp };
