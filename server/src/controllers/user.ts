import { Request, Response } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { BadRequestError } from '../utils/errors';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';
import Follow, { IFollow } from '../models/Follow';
import {
  GetUser,
  GetUsers,
  LogInUser,
  SearchUsers,
  SignUpUser,
  GetLikingUsers,
  GetUserFollowers,
  GetUserFollowings,
} from '../schemas/user';
import { UsernameInput, ResponseBody, ChirpId } from '../schemas';
import Like, { ILike } from '../models/Like';

export const findMany = async (
  req: Request<unknown, ResponseBody, unknown, GetUsers>,
  res: Response<ResponseBody>
) => {
  const { ids, userFields } = req.query;

  const foundUsers = await User.find({ _id: ids }).select(userFields);

  res.status(200).json({ status: 'success', data: foundUsers });
};

export const findOne = async (
  req: Request<UsernameInput, ResponseBody, unknown, GetUser>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { userFields } = req.query;

  const foundUser = await User.findOne({ username }).select(userFields);

  if (!foundUser) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  res.status(200).json({ status: 'success', data: foundUser });
};

export const searchMany = async (
  req: Request<unknown, ResponseBody, unknown, SearchUsers>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { query, followingOnly, userFields, limit, page } = req.query;

  let filter: FilterQuery<IUser> = { $text: { $search: query } };

  if (followingOnly) {
    if (!currentUserId) {
      throw new BadRequestError(
        'You must be logged in to search following users'
      );
    }
    const follows = await Follow.find({ sourceUser: currentUserId });
    const followingIds = follows.map((follow) => follow.targetUser);
    filter = { ...filter, _id: followingIds };
  }

  const sort: { [key: string]: { $meta: 'textScore' } } = {
    score: { $meta: 'textScore' },
  };

  const skip = (page - 1) * limit;

  const foundUsers = await User.find(filter)
    .select(userFields)
    .select({ score: { $meta: 'textScore' } }) // delete score later
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({ status: 'success', data: foundUsers });
};

export const signUp = async (
  req: Request<unknown, ResponseBody, SignUpUser>,
  res: Response<ResponseBody>
) => {
  // verify email
  const { username, email, password, profile } = req.body;

  //dont let mongoose send ugly duplicate key error
  const existingUser = await User.exists({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new BadRequestError('Username or email has already been taken');
  }

  const newUser = await User.create<Omit<IUser, 'replies' | 'metrics'>>({
    username,
    email,
    password,
    profile,
  });
  const { _id } = newUser;

  const authToken = generateAuthToken(_id);

  res.status(201).json({ status: 'success', data: { authToken } });
};

export const logIn = async (
  req: Request<unknown, ResponseBody, LogInUser>,
  res: Response<ResponseBody>
) => {
  const { login, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email: login }, { username: login }],
  });
  if (!existingUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const isPasswordMatch = await existingUser.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new BadRequestError('Sorry, wrong password!');
  }

  const authToken = generateAuthToken(existingUser._id);

  res.status(200).json({ status: 'success', data: { authToken } });
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
  req: Request<ChirpId, ResponseBody, unknown, GetLikingUsers>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;
  const { sinceId, userFields, limit } = req.query;

  const filter: FilterQuery<ILike> = {
    chirp: chirpId,
  };
  Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  const populate = {
    path: 'user',
    select: userFields,
  };

  const likes = await Like.find(filter)
    .populate<PopulatedUser>(populate)
    .sort({ _id: -1 })
    .limit(limit);

  const likingUsers = likes.map((like) => like.user);
  const oldestId = likes[likes.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ status: 'success', data: likingUsers, meta });
};

export const findManyFollowing = async (
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

export const findManyFollowers = async (
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

const generateAuthToken = (currentUserId: Types.ObjectId) => {
  return jwt.sign({ currentUserId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};
