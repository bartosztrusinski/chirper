import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { UsernameInput, ResponseBody } from '../schemas';
import Follow, { IFollow } from '../models/Follow';
import User, { IUser } from '../models/User';
import { GetUserFollowers, GetUserFollowings } from '../schemas/follow';
import { BadRequestError } from '../utils/errors';

interface PopulatedTargetUser {
  targetUser: IUser;
}

interface PopulatedSourceUser {
  sourceUser: IUser;
}

export const getUserFollowings = async (
  req: Request<UsernameInput, ResponseBody, unknown, GetUserFollowings>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, userFields, limit } = req.query;

  const sourceUser = await User.exists({ username });
  if (!sourceUser) {
    throw new BadRequestError(
      'Sorry, we could not find user with that username'
    );
  }

  const filter: FilterQuery<IFollow> = {
    sourceUser: sourceUser._id,
  };
  Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  const populate = {
    path: 'targetUser',
    select: userFields,
  };

  const follows = await Follow.find(filter)
    .populate<PopulatedTargetUser>(populate)
    .sort({ _id: -1 })
    .limit(limit);

  const following = follows.map((follow) => follow.targetUser);
  const oldestId = follows[follows.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ status: 'success', data: following, meta });
};

export const getUserFollowers = async (
  req: Request<UsernameInput, ResponseBody, unknown, GetUserFollowers>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, userFields, limit } = req.query;

  const targetUser = await User.exists({ username });
  if (!targetUser) {
    throw new BadRequestError(
      'Sorry, we could not find user with that username'
    );
  }

  const filter: FilterQuery<IFollow> = {
    targetUser: targetUser._id,
  };
  Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  const populate = {
    path: 'sourceUser',
    select: userFields,
  };

  const follows = await Follow.find(filter)
    .populate<PopulatedSourceUser>(populate)
    .sort({ _id: -1 })
    .limit(limit);

  const followers = follows.map((follow) => follow.sourceUser);
  const oldestId = follows[follows.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({
    status: 'success',
    data: followers,
    meta,
  });
};

export const followUser = async (
  req: Request<unknown, ResponseBody, UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { username } = req.body;

  const currentUser = await User.exists({ _id: currentUserId });
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const targetUser = await User.exists({ username });
  if (!targetUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to follow'
    );
  }

  if (currentUser._id.equals(targetUser._id)) {
    throw new BadRequestError('Sorry, you cannot follow yourself');
  }

  const newFollow = await Follow.create({
    sourceUser: currentUser._id,
    targetUser: targetUser._id,
  });

  res.status(200).json({ status: 'success', data: newFollow });
};

export const unfollowUser = async (
  req: Request<UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { username } = req.params;

  const followedUser = await User.exists({ username });
  if (!followedUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to unfollow'
    );
  }

  const foundFollow = await Follow.findOne({
    sourceUser: currentUserId,
    targetUser: followedUser._id,
  });
  if (!foundFollow) {
    throw new BadRequestError('You are not following this user');
  }

  await foundFollow.remove();

  res.status(200).json({ status: 'success', data: null });
};
