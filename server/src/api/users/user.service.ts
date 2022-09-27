import { FilterQuery, Types } from 'mongoose';
import UserModel from './user.model';
import { SortQuery } from '../../interfaces';
import { Follow } from '../follows/follow.interfaces';
import { Like } from '../likes/like.interfaces';
import { MetricsField, User } from './user.interfaces';
import * as followService from '../follows/follow.service';
import * as likeService from '../likes/like.service';
import config from '../../config/request.config';

const defaultFields = config.user.fields.default;

const findMany = async (
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

const findOne = async (
  id: Types.ObjectId | User['username'] | User['email'],
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

const handleDuplicate = async (
  username: User['username'],
  email: User['email']
) => {
  const usernameTaken = await findOne(username);
  if (usernameTaken) {
    throw new Error('Username has already been taken');
  }

  const emailTaken = await findOne(email);
  if (emailTaken) {
    throw new Error('Email has already been taken');
  }
};

const createOne = async (
  username: User['username'],
  name: User['profile']['name'],
  email: User['email'],
  password: User['password']
) => {
  const newUser = await UserModel.create({
    username,
    email,
    password,
    profile: { name },
  });

  return newUser._id;
};

const deleteOne = async (id: Types.ObjectId) => {
  const user = await findOne(id);
  await user.remove();
};

const updateProfile = async (id: Types.ObjectId, profile: User['profile']) => {
  const user = await findOne(id);

  user.profile = profile;

  const updatedUser = await user.save();

  return updatedUser.profile;
};

const updatePassword = async (
  id: Types.ObjectId,
  password: User['password']
) => {
  const user = await findOne(id);
  user.password = password;
  await user.save();
};

const updateUsername = async (
  id: Types.ObjectId,
  username: User['username']
) => {
  const user = await findOne(id);
  user.username = username;
  await user.save();
};

const updateEmail = async (id: Types.ObjectId, email: User['email']) => {
  const user = await findOne(id);
  user.email = email;
  await user.save();
};

const findFollowedUsersIds = async (
  user: Types.ObjectId,
  limit?: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<Follow> = { sourceUser: user };
  if (sinceId) filter._id = { $lt: sinceId };

  const follows = await followService.findMany(
    filter,
    'targetUser',
    { _id: -1 },
    limit
  );

  const followedUsersIds = follows.map((follow) => follow.targetUser);
  const nextPage = follows[follows.length - 1]?._id;

  return { followedUsersIds, nextPage };
};

const findFollowingUsersIds = async (
  user: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<Follow> = { targetUser: user };
  if (sinceId) filter._id = { $lt: sinceId };

  const follows = await followService.findMany(
    filter,
    'sourceUser',
    { _id: -1 },
    limit
  );

  const followingUsersIds = follows.map((follow) => follow.sourceUser);
  const nextPage = follows[follows.length - 1]?._id;

  return { followingUsersIds, nextPage };
};

const findLikedChirpsIds = async (
  user: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<Like> = { user };
  if (sinceId) filter._id = { $lt: sinceId };

  const likes = await likeService.findMany(filter, 'chirp', { _id: -1 }, limit);

  const likedChirpsIds = likes.map((like) => like.chirp);
  const nextPage = likes[likes.length - 1]?._id;

  return { likedChirpsIds, nextPage };
};

const confirmPassword = async (
  id: Types.ObjectId | User['username'] | User['email'],
  password: User['password']
) => {
  const user = await findOne(id, 'password');

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new Error('Sorry, wrong password!');
  }

  return user._id;
};

const incrementMetrics = async (
  id: Types.ObjectId,
  ...metricsFields: MetricsField[]
) => {
  const user = await findOne(id, 'metrics');
  const uniqueMetricsFields = [...new Set(metricsFields)];

  uniqueMetricsFields.forEach((field) => user.metrics[field]++);

  await user.save();
};

const decrementMetrics = async (
  id: Types.ObjectId,
  ...metricsFields: MetricsField[]
) => {
  const user = await findOne(id, 'metrics');
  const uniqueMetricsFields = [...new Set(metricsFields)];

  uniqueMetricsFields.forEach((field) => user.metrics[field]--);

  await user.save();
};

export {
  findMany,
  findOne,
  createOne,
  deleteOne,
  handleDuplicate,
  confirmPassword,
  incrementMetrics,
  decrementMetrics,
  updateProfile,
  updatePassword,
  updateUsername,
  updateEmail,
  findFollowedUsersIds,
  findFollowingUsersIds,
  findLikedChirpsIds,
};
