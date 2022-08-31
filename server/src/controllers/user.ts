import { Handler } from 'express';
import { Types } from 'mongoose';
import { BadRequestError } from '../utils/errors';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';

export const getUsers: Handler = async (req, res) => {
  const { ids } = req.query;

  const foundUsers = await User.find(
    { _id: { $in: ids } },
    'profile.name username'
  );

  res.status(200).json(foundUsers);
};

export const signUpUser: Handler = async (req, res) => {
  //get user data ✅
  const { username, email, password, profile } = req.body;

  //check if user already exists ✅
  //or let mongoose send ugly duplicate key error
  const existingUser = await User.exists({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new BadRequestError('Username or email has already been taken');
  }

  //check if required fields are filled ✅ mongoose validates this
  //check if fields are valid ✅ mongoose validates this
  //encrypt password ✅ uses bcrypt pre save hook
  //create user ✅
  const newUser = await User.create({ username, email, password, profile });
  const { _id } = newUser;

  //sign token ✅
  const authToken = generateAuthToken(_id);

  //send necessary user data ✅
  res.status(201).json({ _id, authToken });
};

export const logInUser: Handler = async (req, res) => {
  //get user credentials ✅
  const { login, password } = req.body;

  //check if user exists ✅
  const existingUser = await User.findOne({
    $or: [{ email: login }, { username: login }],
  });
  if (!existingUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  //check if password is correct ✅
  const isPasswordMatch = await existingUser.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new BadRequestError('Sorry, wrong password!');
  }

  const { _id } = existingUser;

  //sign token ✅
  const authToken = generateAuthToken(_id);

  //send necessary user data ✅
  res.status(200).json({ _id, authToken });
};

const generateAuthToken = (currentUserId: Types.ObjectId) => {
  return jwt.sign({ currentUserId }, JWT_SECRET, {
    expiresIn: '30d',
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
