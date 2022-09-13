import { Request, Response } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { BadRequestError } from '../utils/errors';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';
import Follow from '../models/Follow';
import {
  GetUserQuery,
  GetUsersQuery,
  LogInUserBody,
  SearchUsersQuery,
  SignUpUserBody,
} from '../schemas/user';
import { Username } from '../schemas';

export const getUsers = async (
  req: Request<
    unknown,
    { status: string; data: object },
    unknown,
    GetUsersQuery
  >,
  res: Response<{ status: string; data: object }>
) => {
  const { ids, userFields } = req.query;

  const foundUsers = await User.find({ _id: ids }).select(userFields);

  res.status(200).json({ status: 'success', data: foundUsers });
};

export const getUser = async (
  req: Request<
    Username,
    { status: string; data: object },
    unknown,
    GetUserQuery
  >,
  res: Response<{ status: string; data: object }>
) => {
  const { username } = req.params;
  const { userFields } = req.query;

  const foundUser = await User.findOne({ username }).select(userFields);

  if (!foundUser) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  res.status(200).json({ status: 'success', data: foundUser });
};

export const searchUsers = async (
  req: Request<
    unknown,
    { status: string; data: object },
    unknown,
    SearchUsersQuery
  >,
  res: Response<{ status: string; data: object }>
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
    .skip(skip) // not the best way to do this
    .limit(limit);

  res.status(200).json({ status: 'success', data: foundUsers });
};

export const signUpUser = async (
  req: Request<unknown, { status: string; data: object }, SignUpUserBody>,
  res: Response<{ status: string; data: object }>
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

export const logInUser = async (
  req: Request<unknown, { status: string; data: object }, LogInUserBody>,
  res: Response<{ status: string; data: object }>
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

const generateAuthToken = (currentUserId: Types.ObjectId) => {
  return jwt.sign({ currentUserId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};
