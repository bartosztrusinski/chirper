import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError } from '../utils/errors';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/secrets';

export const getAllUsers = async (req: Request, res: Response) => {
  const allUsers = await User.find();
  res.status(200).json(allUsers);
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

  //jtw token ✅
  const token = generateJwt(newUser._id);
  //send necessary user data ✅
  res.status(201).json({ id: newUser._id, token });
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
  //jwt token ✅
  const token = generateJwt(existingUser._id);
  //send necessary user data ✅
  res.status(200).json({ id: existingUser._id, token });
};

const generateJwt = (id: mongoose.Types.ObjectId) => {
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
  return token;
};

export const getUser = async (req: Request, res: Response) => {
  const { userID } = req.params;

  const foundUser = await User.findById(userID);
  if (!foundUser) {
    throw new BadRequestError('User not found');
  }
  res.status(200).json(foundUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const { userID } = req.params;
  const { userData } = req.body;
  const isValid = mongoose.Types.ObjectId.isValid(userID);
  if (!isValid) {
    throw new BadRequestError('Invalid user ID');
  }
  const updatedUser = await User.findByIdAndUpdate(userID, userData, {
    new: true,
  });
  if (!updatedUser) {
    throw new BadRequestError('User not found');
  }
  res.status(200).json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userID } = req.params;
  const deletedUser = await User.findByIdAndDelete(userID);
  if (!deletedUser) {
    throw new BadRequestError('User not found');
  }
  res.status(200).json({ id: userID });
};
