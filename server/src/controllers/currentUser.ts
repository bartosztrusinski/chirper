import { Request, Response } from 'express';
import User from '../models/User';
import {
  UpdateEmail,
  UpdatePassword,
  UpdateUsername,
  UserProfile,
} from '../schemas/currentUser';
import { ResponseBody } from '../schemas';
import { GetUser } from '../schemas/user';
import { BadRequestError } from '../utils/errors';

export const getCurrentUser = async (
  req: Request<unknown, ResponseBody, unknown, GetUser>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { userFields } = req.query;

  const currentUser = await User.findById(currentUserId).select(userFields);

  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  res.status(200).json({ status: 'success', data: currentUser });
};

export const updateCurrentUserProfile = async (
  req: Request<unknown, ResponseBody, UserProfile>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { name, picture, header, bio, location, website } = req.body;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  currentUser.profile = {
    name,
    picture,
    header,
    bio,
    location,
    website,
  };
  const updatedUser = await currentUser.save();

  res.status(200).json({ status: 'success', data: updatedUser.profile });
};

export const updateCurrentUserPassword = async (
  req: Request<unknown, ResponseBody, UpdatePassword>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { newPassword } = req.body;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  currentUser.password = newPassword;
  await currentUser.save();

  res.status(200).json({ status: 'success', data: null });
};

export const updateCurrentUserUsername = async (
  req: Request<unknown, ResponseBody, UpdateUsername>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { newUsername } = req.body;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  currentUser.username = newUsername;
  await currentUser.save();

  res.status(200).json({ status: 'success', data: { newUsername } });
};

export const updateCurrentUserEmail = async (
  req: Request<unknown, ResponseBody, UpdateEmail>,
  res: Response<ResponseBody>
) => {
  // verify new email
  const { currentUserId } = req;
  const { newEmail } = req.body;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  currentUser.email = newEmail;
  await currentUser.save();

  res.status(200).json({ status: 'success', data: { newEmail } });
};

export const deleteCurrentUser = async (
  req: Request,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  await currentUser.remove();

  res.status(200).json({ status: 'success', data: null });
};

// export const confirmCurrentUserPassword: Handler = async (req, res) => {
//   const { password } = req.body;

//   const currentUser = await User.findById(req.currentUserId);
//   if (!currentUser) {
//     throw new BadRequestError('Sorry, we could not find your account');
//   }

//   const isPasswordMatch = await currentUser.isPasswordMatch(password);
//   if (!isPasswordMatch) {
//     throw new BadRequestError('Sorry, wrong password!');
//   }

//   res.status(200).json({ message: 'Password confirmed' });
// };
