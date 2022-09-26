import { FilterQuery, Types } from 'mongoose';
import config from '../../config/request.config';
import FollowModel from './follow.model';
import { Follow } from './follow.interfaces';
import { SortQuery } from '../../interfaces';

const defaultFields = config.follow.fields.default;

export const findOne = async (filter: FilterQuery<Follow>) => {
  const follow = await FollowModel.findOne(filter).select(
    'sourceUser targetUser'
  );

  if (!follow) {
    throw new Error('Sorry, we could not find the follow you are looking for');
  }

  return follow;
};

export const findMany = async (
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

export const createOne = async (
  sourceUser: Types.ObjectId,
  targetUser: Types.ObjectId
) => {
  await FollowModel.create({ sourceUser, targetUser });
};

export const deleteOne = async (
  sourceUser: Types.ObjectId,
  targetUser: Types.ObjectId
) => {
  const follow = await findOne({ sourceUser, targetUser });
  await follow.remove();
};

export const handleDuplicate = async (
  sourceUser: Types.ObjectId,
  targetUser: Types.ObjectId
) => {
  const follow = await findOne({ sourceUser, targetUser });
  if (follow) {
    throw new Error('Sorry, you are already following this user');
  }
};

export const deleteMany = async (filter: FilterQuery<Follow>) => {
  const follows = await findMany(filter);
  await Promise.all(follows.map((follow) => follow.remove()));
};
