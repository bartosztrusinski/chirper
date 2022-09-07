import { Handler } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { BadRequestError } from '../utils/errors';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';
import Follow from '../models/Follow';

export const getUsers: Handler = async (req, res) => {
  const { ids } = req.query;

  const foundUsers = await User.find(
    { _id: { $in: ids } },
    'profile.name username'
  );

  res.status(200).json(foundUsers);
};

export const searchUsers: Handler = async (req, res) => {
  const { query, followingOnly } = req.query;

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
  const projection = { score: { $meta: 'textScore' }, profile: 1, username: 1 }; // delete score later

  let filter: FilterQuery<IUser> = { $text: { $search: query as string } };

  if (followingOnly) {
    if (!req.currentUserId) {
      throw new BadRequestError('You must be logged in to do that');
    }
    const follows = await Follow.find({ sourceUser: req.currentUserId });
    const followingIds = follows.map((follow) => follow.targetUser);
    filter = { ...filter, _id: followingIds };
  }

  const users = await User.find(filter)
    .projection(projection)
    .sort(sort)
    .skip(skip) // not the best way to do this
    .limit(limit);

  res.status(200).json(users);
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

  res.status(201).json({ _id, authToken });
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

  res.status(200).json({ _id, authToken });
};

const generateAuthToken = (currentUserId: Types.ObjectId) => {
  return jwt.sign({ currentUserId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const getUser: Handler = async (req, res) => {
  const { username } = req.params;

  const foundUser = await User.findOne({ username });
  if (!foundUser) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  const { _id, email, profile } = foundUser;
  res.status(200).json({ _id, username, email, profile });
};
