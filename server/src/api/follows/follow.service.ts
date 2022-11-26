import { FilterQuery, Types } from 'mongoose';
import FollowModel from './follow.model';
import { Follow } from './follow.interfaces';
import { SortQuery } from '../../interfaces';
import config from '../../config/request.config';

const defaultFields = config.follow.fields.default;

const findOne = async (filter: FilterQuery<Follow>) => {
  const follow = await FollowModel.findOne(filter).select(
    'sourceUser targetUser'
  );

  if (!follow) {
    throw new Error('Sorry, we could not find the follow you are looking for');
  }

  return follow;
};

const findMany = async (
  filter: FilterQuery<Follow>,
  select: string = defaultFields,
  sort?: SortQuery,
  limit?: number,
  skip?: number
) => {
  const query = FollowModel.find(filter).select(select).sort(sort);

  if (limit) query.limit(limit);
  if (skip) query.skip(skip);

  const follows = await query;

  return follows;
};

const createOne = async (
  sourceUser: Types.ObjectId,
  targetUser: Types.ObjectId
) => {
  await FollowModel.create({ sourceUser, targetUser });
};

const deleteOne = async (
  sourceUser: Types.ObjectId,
  targetUser: Types.ObjectId
) => {
  const follow = await findOne({ sourceUser, targetUser });

  await follow.remove();
};

const handleDuplicate = async (
  sourceUser: Types.ObjectId,
  targetUser: Types.ObjectId
) => {
  const follow = await FollowModel.findOne({ sourceUser, targetUser });

  if (follow) {
    throw new Error('Sorry, you are already following this user');
  }
};

const deleteMany = async (filter: FilterQuery<Follow>) => {
  const follows = await findMany(filter);
  await Promise.all(follows.map((follow) => follow.remove()));
};

export { findOne, findMany, createOne, deleteOne, handleDuplicate, deleteMany };
