import { FilterQuery, Types } from 'mongoose';
import LikeModel from './like.model';
import { Like } from './like.interfaces';
import { SortQuery } from '../../interfaces';
import config from '../../config/request.config';

const defaultFields = config.like.fields.default;

const findOne = async (user: Types.ObjectId, chirp: Types.ObjectId) => {
  const like = await LikeModel.findOne({ user, chirp }).select('user chirp');

  if (!like) {
    throw new Error('Sorry, we could not find that like');
  }

  return like;
};

const findMany = async (
  filter: FilterQuery<Like>,
  select: string = defaultFields,
  sort?: SortQuery,
  limit?: number,
  skip?: number
) => {
  const query = LikeModel.find(filter).select(select).sort(sort);

  if (limit) query.limit(limit);
  if (skip) query.skip(skip);

  const likes = await query;

  return likes;
};

const createOne = async (user: Types.ObjectId, chirp: Types.ObjectId) => {
  await LikeModel.create({ user, chirp });
};

const deleteOne = async (user: Types.ObjectId, chirp: Types.ObjectId) => {
  const like = await findOne(user, chirp);
  await like.remove();
};

const handleDuplicate = async (user: Types.ObjectId, chirp: Types.ObjectId) => {
  const like = await LikeModel.findOne({ user, chirp });

  if (like) {
    throw new Error('Sorry, you have already liked this chirp');
  }
};

const deleteMany = async (filter: FilterQuery<Like>) => {
  const likes = await findMany(filter);
  await Promise.all(likes.map((like) => like.remove()));
};

export { findOne, findMany, createOne, deleteOne, handleDuplicate, deleteMany };
