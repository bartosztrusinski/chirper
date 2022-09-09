import { Handler } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { BadRequestError } from '../utils/errors';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';
import Follow from '../models/Follow';

export const getUsers: Handler = async (req, res) => {
  const { ids, userFields } = req.query;

  if (ids instanceof Array && ids.length > 100) {
    throw new BadRequestError(
      'Sorry, you can only request up to 100 users at a time'
    );
  }

  const userSelect = userFields
    ? (userFields as string)
        .replace(/,/g, ' ')
        .replace(/__v|password|email/g, '')
        .trim()
    : '';

  const foundUsers = await User.find({ _id: ids }).select(
    `${userSelect} username`
  );

  res.status(200).json({ status: 'success', data: foundUsers });
};

export const getUser: Handler = async (req, res) => {
  const { username } = req.params;
  const { userFields } = req.query;

  const userSelect = userFields
    ? (userFields as string)
        .replace(/,/g, ' ')
        .replace(/__v|password|email/g, '')
        .trim()
    : '';

  const foundUser = await User.findOne({ username }).select(
    `${userSelect} username`
  );

  if (!foundUser) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  res.status(200).json({ status: 'success', data: foundUser });
};

export const searchUsers: Handler = async (req, res) => {
  const { query, followingOnly, userFields } = req.query;

  if (!query) {
    throw new BadRequestError('Query is required');
  }

  const limit = Math.min(
    Math.abs(parseInt(req.query.limit as string)) || 10,
    20
  );
  const page = Math.abs(parseInt(req.query.page as string) || 1);
  const skip = (page - 1) * limit;
  const sort: { [key: string]: { $meta: 'textScore' } } = {
    score: { $meta: 'textScore' },
  };

  let filter: FilterQuery<IUser> = { $text: { $search: query as string } };

  if (followingOnly) {
    if (!req.currentUserId) {
      throw new BadRequestError('You must be logged in to do that');
    }
    const follows = await Follow.find({ sourceUser: req.currentUserId });
    const followingIds = follows.map((follow) => follow.targetUser);
    filter = { ...filter, _id: followingIds };
  }

  const userSelect = userFields
    ? (userFields as string)
        .replace(/,/g, ' ')
        .replace(/__v|password|email/g, '')
        .trim()
    : '';

  const foundUsers = await User.find(filter)
    .select(`${userSelect} username`)
    .select({ score: { $meta: 'textScore' } }) // delete score later
    .sort(sort)
    .skip(skip) // not the best way to do this
    .limit(limit);

  res.status(200).json({ status: 'success', data: foundUsers });
};

export const signUpUser: Handler = async (req, res) => {
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

export const logInUser: Handler = async (req, res) => {
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

  const { _id } = existingUser;

  const authToken = generateAuthToken(_id);

  res.status(200).json({ status: 'success', data: { authToken } });
};

const generateAuthToken = (currentUserId: Types.ObjectId) => {
  return jwt.sign({ currentUserId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};
