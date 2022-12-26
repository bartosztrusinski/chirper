import { Schema, model } from 'mongoose';
import * as userService from '../users/user.service';
import * as chirpService from './chirp.service';
import * as likeService from '../likes/like.service';
import {
  Chirp,
  Post,
  Reply,
  ChirpModel,
  PostModel,
  ReplyModel,
} from './chirp.interfaces.';

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

chirpSchema.pre('save', function (next) {
  this.$locals.wasNew = this.isNew;
  next();
});

chirpSchema.post('save', async function incrementMetrics() {
  if (this.$locals.wasNew) {
    await userService.incrementMetrics(this.author, 'chirpCount');
  }
});

chirpSchema.post('remove', async function removeDependencies() {
  await userService.decrementMetrics(this.author, 'chirpCount');
  await likeService.deleteMany({ chirp: this._id });
  await chirpService.deleteMany({ _id: this.replies });
});

replySchema.post('save', async function pushToParent() {
  if (this.$locals.wasNew) {
    await chirpService.pushReply(this.parent, this._id);
  }
});

replySchema.post('remove', async function pullFromParent() {
  await chirpService.pullReply(this.parent, this._id);
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
