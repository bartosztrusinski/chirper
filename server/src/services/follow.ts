import { FilterQuery, Types } from 'mongoose';
import Follow, { IFollow } from '../models/Follow';

export const findOne = async (filter: FilterQuery<IFollow>) => {
  const follow = await Follow.findOne(filter).select('sourceUser targetUser');
  if (!follow) {
    throw new Error('Sorry, we could not find the follow you are looking for');
  }
  return follow;
};

export const createOne = async (
  sourceUser: Types.ObjectId,
  targetUser: Types.ObjectId
) => {
  await Follow.create({ sourceUser, targetUser });
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
