import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError } from '../utils/errors';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
  const allUsers = await User.find();
  res.status(200).json(allUsers);
};

export const createUser = async (req: Request, res: Response) => {
  const { userData } = req.body;
  const newUser = await User.create(userData);
  res.status(201).json(newUser);
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
