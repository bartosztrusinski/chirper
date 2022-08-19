import { Handler, Request, Response } from 'express';
import { Types } from 'mongoose';
import { BadRequestError } from '../utils/errors';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/secrets';

export const getAllUsers = async (req: Request, res: Response) => {
  const allUsers = await User.find();

  res.status(200).json(
    allUsers.map(({ _id, username, profile }) => ({
      _id,
      username,
      profile,
    }))
  );
};

export const signUpUser = async (req: Request, res: Response) => {
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

export const logInUser = async (req: Request, res: Response) => {
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
  const isPasswordCorrect = await existingUser.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError('Sorry, wrong password!');
  }

  const { _id } = existingUser;

  //sign token ✅
  const authToken = generateAuthToken(_id);

  //send necessary user data ✅
  res.status(200).json({ _id, authToken });
};

const generateAuthToken = (loggedInUserId: Types.ObjectId) => {
  return jwt.sign({ loggedInUserId }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const getLoggedInUser: Handler = async (req, res) => {
  const loggedInUser = await User.findById(req.loggedInUserId);
  if (!loggedInUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const { _id, username } = loggedInUser;

  res.status(200).json({ _id, username });
};

export const getUser = async (req: Request, res: Response) => {
  const { userID } = req.params;

  const foundUser = await User.findById(userID);
  if (!foundUser) {
    throw new BadRequestError('User not found');
  }

  const { _id, username, profile } = foundUser;

  res.status(200).json({ _id, username, profile });
};

export const updateUser = async (req: Request, res: Response) => {
  const { userID } = req.params;
  const { userData } = req.body;

  const isValid = Types.ObjectId.isValid(userID);
  if (!isValid) {
    throw new BadRequestError('Invalid user ID');
  }

  const updatedUser = await User.findByIdAndUpdate(userID, userData, {
    new: true,
  });
  if (!updatedUser) {
    throw new BadRequestError('Sorry, could not find that user');
  }

  res.status(200).json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userID } = req.params;

  const deletedUser = await User.findByIdAndDelete(userID);
  if (!deletedUser) {
    throw new BadRequestError('Sorry, could not find that user');
  }

  res.status(200).json({ _id: deletedUser._id });
};
