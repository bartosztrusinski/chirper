import { FilterQuery, SortOrder, Types } from 'mongoose';
import Follow, { IFollow } from '../models/Follow';
import Like, { ILike } from '../models/Like';
import User, { IUser } from '../models/User';
import { Email, Name, Password, Username, Profile } from '../schemas';
import config from '../config/request';

export const findMany = async (
  filter: FilterQuery<IUser>,
  select = config.user.fields.default,
  sort?: { [key: string]: SortOrder | { $meta: 'textScore' } },
  limit?: number,
  skip?: number
) => {
  const query = User.find(filter)
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
  select = config.user.fields.default
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
  const newUser = await User.create({
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
  const filter: FilterQuery<IFollow> = { sourceUser: user };
  if (sinceId) {
    filter._id = { $lt: sinceId };
  }
  const query = Follow.find(filter).sort({ _id: -1 });
  if (limit) query.limit(limit);

  const follows = await query;
  const followedUsersIds = follows.map((follow) => follow.targetUser);
  const nextPage = follows[follows.length - 1]?._id;
  return { followedUsersIds, nextPage };
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
  const nextPage = follows[follows.length - 1]?._id;
  return { followingUsersIds, nextPage };
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
