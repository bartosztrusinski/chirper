import { Types } from 'mongoose';
import Like from '../models/Like';

export const findOne = async (user: Types.ObjectId, chirp: Types.ObjectId) => {
  const like = await Like.findOne({ user, chirp });
  if (!like) {
    throw new Error('Sorry, we could not find that like');
  }
  return like;
};

export const createOne = async (
  user: Types.ObjectId,
  chirp: Types.ObjectId
) => {
  await Like.create({ user, chirp });
};

export const deleteOne = async (
  user: Types.ObjectId,
  chirp: Types.ObjectId
) => {
  const like = await findOne(user, chirp);
  await like.remove();
};

export const handleDuplicate = async (
  user: Types.ObjectId,
  chirp: Types.ObjectId
) => {
  const like = await findOne(user, chirp);
  if (like) {
    throw new Error('Sorry, you have already liked this chirp');
  }
};
