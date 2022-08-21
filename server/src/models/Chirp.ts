import { Schema, Types, model, Model } from 'mongoose';

interface IChirp {
  content: string;
  likes: number; //temporary
  author: Types.ObjectId;
  replies: Types.ObjectId[];
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

const Chirp = model<IChirp, ChirpModel>('Chirp', chirpSchema);

const PostChirp = Chirp.discriminator<IChirp, ChirpModel>(
  'Post',
  new Schema({})
);

const ReplyChirp = Chirp.discriminator<IChirp, ChirpModel>(
  'Reply',
  new Schema({})
);

export { Chirp, PostChirp, ReplyChirp };
