import { Request, Response } from 'express';
import { FilterQuery, Types } from 'mongoose';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';
import Follow, { IFollow } from '../models/Follow';
import {
  FindOne,
  FindMany,
  LogIn,
  SearchMany,
  SignUp,
  FindManyLiking,
  FindManyFollowers,
  FindManyFollowing,
} from '../schemas/user';
import { UsernameInput, ResponseBody, ChirpId } from '../schemas';
import Like, { ILike } from '../models/Like';
import * as User2 from '../services/user';

export const findMany = async (
  req: Request<unknown, ResponseBody, unknown, FindMany>,
  res: Response<ResponseBody>
) => {
  const { ids, userFields } = req.query;

  // const foundUsers = await User.find({ _id: ids }).select(userFields);
  const foundUsers = await User2.findMany({ _id: ids }, userFields);

  res.status(200).json({ data: foundUsers });
};

export const findOne = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindOne>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { userFields } = req.query;

  // const foundUser = await User.findOne({ username }).select(userFields);

  // if (!foundUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find that user');
  // }
  const foundUser = await User2.findOne(username, userFields);

  res.status(200).json({ data: foundUser });
};

export const searchMany = async (
  req: Request<unknown, ResponseBody, unknown, SearchMany>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { query, followingOnly, userFields, limit, page } = req.query;

  let filter: FilterQuery<IUser> = { $text: { $search: query } };

  if (followingOnly) {
    if (!currentUserId) {
      res.status(400);
      throw new Error('You must be logged in to search following users');
    }
    const follows = await Follow.find({ sourceUser: currentUserId });
    const followingIds = follows.map((follow) => follow.targetUser);
    filter = { ...filter, _id: followingIds };
  }

  const sort: { [key: string]: { $meta: 'textScore' } } = {
    score: { $meta: 'textScore' },
  };

  const skip = (page - 1) * limit;

  // const foundUsers = await User.find(filter)
  //   .select(userFields)
  //   .select({ score: { $meta: 'textScore' } }) // delete score later
  //   .sort(sort)
  //   .skip(skip)
  //   .limit(limit);
  const foundUsers = await User2.findMany(
    filter,
    userFields,
    sort,
    limit,
    skip
  );

  res.status(200).json({ data: foundUsers });
};

export const signUp = async (
  req: Request<unknown, ResponseBody, SignUp>,
  res: Response<ResponseBody>
) => {
  // verify email
  const { username, email, password, name } = req.body;

  //dont let mongoose send ugly duplicate key error
  // const existingUser = await User.exists({
  //   $or: [{ email }, { username }],
  // });
  // if (existingUser) {
  //   res.status(400);
  //   throw new Error('Username or email has already been taken');
  // }

  await User2.handleDuplicate(username, email);

  // const newUser = await User.create<Omit<IUser, 'replies' | 'metrics'>>({
  //   username,
  //   email,
  //   password,
  //   profile,
  // });
  // const { _id } = newUser;
  const newUserId = await User2.createOne(username, name, email, password);

  const authToken = generateAuthToken(newUserId);

  res.status(201).json({ data: { _id: newUserId, authToken } });
};

export const logIn = async (
  req: Request<unknown, ResponseBody, LogIn>,
  res: Response<ResponseBody>
) => {
  const { login, password } = req.body;

  // const existingUser = await User.findOne({
  //   $or: [{ email: login }, { username: login }],
  // });
  // if (!existingUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }
  res.status(400);
  const existingUser = await User2.findOne(login);

  const isPasswordMatch = await existingUser.isPasswordMatch(password); // middleware?
  if (!isPasswordMatch) {
    res.status(400);
    throw new Error('Sorry, wrong password!');
  }

  const { _id } = existingUser;

  const authToken = generateAuthToken(existingUser._id);

  res.status(200).json({ data: { _id, authToken } });
};

interface PopulatedUser {
  user: IUser;
}
interface PopulatedTargetUser {
  targetUser: IUser;
}

interface PopulatedSourceUser {
  sourceUser: IUser;
}

export const findManyLiking = async (
  req: Request<ChirpId, ResponseBody, unknown, FindManyLiking>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;
  const { sinceId, userFields, limit } = req.query;

  // const filter: FilterQuery<ILike> = {
  //   chirp: chirpId,
  // };
  // Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  // const populate = {
  //   path: 'user',
  //   select: userFields,
  // };

  const { likingUsersIds, oldestId } = await User2.findLikingUsersIds(
    chirpId,
    limit,
    sinceId
  );

  const likingUsers = await User2.findMany({ _id: likingUsersIds }, userFields);

  // const likes = await Like.find(filter)
  //   .populate<PopulatedUser>(populate)
  //   .sort({ _id: -1 })
  //   .limit(limit);

  // const likingUsers = likes.map((like) => like.user);
  // const oldestId = likes[likes.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ data: likingUsers, meta });
};

export const findManyFollowing = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyFollowing>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, userFields, limit } = req.query;

  // const sourceUser = await User.exists({ username });
  // if (!sourceUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find user with that username');
  // }
  res.status(400);
  const sourceUserId = await User2.exists(username);

  // const filter: FilterQuery<IFollow> = {
  //   sourceUser: sourceUserId,
  // };
  // Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  // const populate = {
  //   path: 'targetUser',
  //   select: userFields,
  // };

  const { followedUsersIds, oldestId } = await User2.findFollowedUsersIds(
    sourceUserId,
    limit,
    sinceId
  );

  const followedUsers = await User2.findMany(
    { _id: followedUsersIds },
    userFields
  );

  // const follows = await Follow.find(filter)
  //   .populate<PopulatedTargetUser>(populate)
  //   .sort({ _id: -1 })
  //   .limit(limit);

  // const followingUsers = follows.map((follow) => follow.targetUser);
  // const oldestId = follows[follows.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ data: followedUsers, meta });
};

export const findManyFollowers = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyFollowers>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, userFields, limit } = req.query;

  // const targetUser = await User.exists({ username });
  // if (!targetUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find user with that username');
  // }
  res.status(400);
  const targetUserId = await User2.exists(username);

  // const filter: FilterQuery<IFollow> = {
  //   targetUser: targetUser._id,
  // };
  // Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  // const populate = {
  //   path: 'sourceUser',
  //   select: userFields,
  // };

  const { followingUsersIds, oldestId } = await User2.findFollowingUsersIds(
    targetUserId,
    limit,
    sinceId
  );

  const followingUsers = await User2.findMany(
    { _id: followingUsersIds },
    userFields
  );

  // const follows = await Follow.find(filter)
  //   .populate<PopulatedSourceUser>(populate)
  //   .sort({ _id: -1 })
  //   .limit(limit);

  // const followersUsers = follows.map((follow) => follow.sourceUser);
  // const oldestId = follows[follows.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ data: followingUsers, meta });
};

const generateAuthToken = (currentUserId: Types.ObjectId) => {
  return jwt.sign({ currentUserId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};
