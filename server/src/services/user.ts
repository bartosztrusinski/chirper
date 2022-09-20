import { FilterQuery, SortOrder, Types } from 'mongoose';
import Follow, { IFollow } from '../models/Follow';
import Like, { ILike } from '../models/Like';
import User, { IUser } from '../models/User';
import {
  Email,
  Name,
  Password,
  Username,
  USER_DEFAULT_FIELD,
} from '../schemas';

export const findFollowedUsersIds = async (
  user: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<IFollow> = { sourceUser: user };
  if (sinceId) {
    filter._id = { $lt: sinceId };
  }
  const follows = await Follow.find(filter).sort({ _id: -1 }).limit(limit);
  const followedUsersIds = follows.map((follow) => follow.targetUser);
  const oldestId = follows[follows.length - 1]?._id;
  return { followedUsersIds, oldestId };
};

export const findFollowingUsersIds = async (
  user: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<IFollow> = { targetUser: user };
  if (sinceId) {
    filter._id = { $lt: sinceId };
  }
  const follows = await Follow.find(filter).sort({ _id: -1 }).limit(limit);
  const followingUsersIds = follows.map((follow) => follow.sourceUser);
  const oldestId = follows[follows.length - 1]?._id;
  return { followingUsersIds, oldestId };
};

export const findLikedChirpsIds = async (
  user: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<ILike> = { user };
  if (sinceId) {
    filter._id = { $lt: sinceId };
  }

  const likes = await Like.find(filter).sort({ _id: -1 }).limit(limit);
  const likedChirpsIds = likes.map((like) => like.chirp);
  const oldestId = likes[likes.length - 1]?._id;
  return { likedChirpsIds, oldestId };
};

export const exists = async (username: string) => {
  const user = await User.exists({ username });
  if (!user) {
    throw new Error('Sorry, we could not find that user');
  }
  return user._id;
};

export const handleDuplicate = async (username: Username, email: Email) => {
  const user = await User.exists({ $or: [{ username }, { email }] });
  if (user) {
    throw new Error('Username or email has already been taken');
  }
};

export const findMany = async (
  filter: FilterQuery<IUser>,
  select = USER_DEFAULT_FIELD,
  sort?: { [key: string]: SortOrder | { $meta: 'textScore' } },
  limit?: number,
  skip?: number
) => {
  const query = User.find(filter).select(select).sort(sort);
  if (limit) query.limit(limit);
  if (skip) query.skip(skip);
  const users = await query;
  return users;
};

export const findOne = async (
  id: Types.ObjectId | Username | Email,
  select = USER_DEFAULT_FIELD
) => {
  const filter =
    id instanceof Types.ObjectId
      ? { _id: id }
      : { $or: [{ username: id }, { email: id }] };
  const user = await User.findOne(filter).select(select);
  if (!user) {
    throw new Error('Sorry, we could not find that user');
  }
  return user;
};

export const createOne = async (
  username: Username,
  name: Name,
  email: Email,
  password: Password
) => {
  const newUser = await User.create({
    username,
    email,
    password,
    profile: { name },
  });
  return newUser._id;
};

export const findLikingUsersIds = async (
  chirp: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<ILike> = { chirp };
  if (sinceId) {
    filter._id = { $lt: sinceId };
  }

  const likes = await Like.find(filter).sort({ _id: -1 }).limit(limit);
  const likingUsersIds = likes.map((like) => like.user);
  const oldestId = likes[likes.length - 1]?._id;
  return { likingUsersIds, oldestId };
};
