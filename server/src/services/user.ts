import { FilterQuery, Types } from 'mongoose';
import * as FollowService from './follow';
import * as LikeService from './like';
import UserModel from '../models/User';
import {
  Email,
  Name,
  Password,
  Username,
  Profile,
  MetricsField,
  User,
} from '../types/user';
import config from '../config/request';
import { SortQuery } from '../types/general';
import { Follow } from '../types/follow';
import { Like } from '../types/like';

const defaultFields = config.user.fields.default;

export const findMany = async (
  filter: FilterQuery<User>,
  select: string = defaultFields,
  sort?: SortQuery,
  limit?: number,
  skip?: number
) => {
  const query = UserModel.find(filter)
    .select(select)
    // .select({ score: { $meta: 'textScore' } })
    .sort(sort);

  if (limit) query.limit(limit);
  if (skip) query.skip(skip);

  const users = await query;

  return users;
};

export const findOne = async (
  id: Types.ObjectId | Username | Email,
  select: string = defaultFields
) => {
  const filter =
    id instanceof Types.ObjectId
      ? { _id: id }
      : { $or: [{ username: id }, { email: id }] };

  const user = await UserModel.findOne(filter).select(select);

  if (!user) {
    throw new Error('Sorry, we could not find that user');
  }

  return user;
};

export const handleDuplicate = async (username: Username, email: Email) => {
  const usernameTaken = await findOne(username);
  if (usernameTaken) {
    throw new Error('Username has already been taken');
  }

  const emailTaken = await findOne(email);
  if (emailTaken) {
    throw new Error('Email has already been taken');
  }
};

export const createOne = async (
  username: Username,
  name: Name,
  email: Email,
  password: Password
) => {
  const newUser = await UserModel.create({
    username,
    email,
    password,
    profile: { name },
  });

  return newUser._id;
};

export const deleteOne = async (id: Types.ObjectId) => {
  const user = await findOne(id);
  await user.remove();
};

export const updateProfile = async (id: Types.ObjectId, profile: Profile) => {
  const user = await findOne(id);

  user.profile = profile;

  const updatedUser = await user.save();

  return updatedUser.profile;
};

export const updatePassword = async (
  id: Types.ObjectId,
  password: Password
) => {
  const user = await findOne(id);
  user.password = password;
  await user.save();
};

export const updateUsername = async (
  id: Types.ObjectId,
  username: Username
) => {
  const user = await findOne(id);
  user.username = username;
  await user.save();
};

export const updateEmail = async (id: Types.ObjectId, email: Email) => {
  const user = await findOne(id);
  user.email = email;
  await user.save();
};

export const findFollowedUsersIds = async (
  user: Types.ObjectId,
  limit?: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<Follow> = { sourceUser: user };
  if (sinceId) filter._id = { $lt: sinceId };

  const follows = await FollowService.findMany(
    filter,
    'targetUser',
    { _id: -1 },
    limit
  );

  const followedUsersIds = follows.map((follow) => follow.targetUser);
  const nextPage = follows[follows.length - 1]?._id;

  return { followedUsersIds, nextPage };
};

export const findFollowingUsersIds = async (
  user: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<Follow> = { targetUser: user };
  if (sinceId) filter._id = { $lt: sinceId };

  const follows = await FollowService.findMany(
    filter,
    'sourceUser',
    { _id: -1 },
    limit
  );

  const followingUsersIds = follows.map((follow) => follow.sourceUser);
  const nextPage = follows[follows.length - 1]?._id;

  return { followingUsersIds, nextPage };
};

export const findLikedChirpsIds = async (
  user: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<Like> = { user };
  if (sinceId) filter._id = { $lt: sinceId };

  const likes = await LikeService.findMany(filter, 'chirp', { _id: -1 }, limit);

  const likedChirpsIds = likes.map((like) => like.chirp);
  const nextPage = likes[likes.length - 1]?._id;

  return { likedChirpsIds, nextPage };
};

export const confirmPassword = async (
  id: Types.ObjectId | Username | Email,
  password: Password
) => {
  const user = await findOne(id, 'password');

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new Error('Sorry, wrong password!');
  }

  return user._id;
};

export const incrementMetrics = async (
  id: Types.ObjectId,
  ...metricsFields: MetricsField[]
) => {
  const user = await findOne(id, 'metrics');
  const uniqueMetricsFields = [...new Set(metricsFields)];

  uniqueMetricsFields.forEach((field) => user.metrics[field]++);

  await user.save();
};

export const decrementMetrics = async (
  id: Types.ObjectId,
  ...metricsFields: MetricsField[]
) => {
  const user = await findOne(id, 'metrics');
  const uniqueMetricsFields = [...new Set(metricsFields)];

  uniqueMetricsFields.forEach((field) => user.metrics[field]--);

  await user.save();
};
