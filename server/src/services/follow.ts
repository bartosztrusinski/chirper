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
  sourceUserId: Types.ObjectId,
  targetUserId: Types.ObjectId
) => {
  await Follow.create({
    sourceUser: sourceUserId,
    targetUser: targetUserId,
  });
};

export const deleteOne = async (
  sourceUserId: Types.ObjectId,
  targetUserId: Types.ObjectId
) => {
  const follow = await findOne({
    sourceUser: sourceUserId,
    targetUser: targetUserId,
  });

  await follow.remove();
};
