import { Request, Response } from 'express';
import {
  UpdateEmail,
  UpdatePassword,
  UpdateUsername,
  UserProfile,
  FindOne,
} from '../schemas/currentUser';
import { ResponseBody } from '../schemas';
import * as UserService from '../services/user';
import { Types } from 'mongoose';
import createResponse from '../utils/createResponse';

export const getOne = async (
  req: Request<unknown, ResponseBody, unknown, FindOne>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { userFields } = req.query;

  res.status(400);

  const currentUser = await UserService.findOne(currentUserId, userFields);

  res.status(200).json(createResponse(currentUser));
};

export const updateProfile = async (
  req: Request<unknown, ResponseBody, UserProfile>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const profile = req.body;

  res.status(400);

  const updatedProfile = await UserService.updateProfile(
    currentUserId,
    profile
  );

  res.status(200).json(createResponse(updatedProfile));
};

export const updatePassword = async (
  req: Request<unknown, ResponseBody, UpdatePassword>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { newPassword } = req.body;

  res.status(400);

  await UserService.updatePassword(currentUserId, newPassword);

  res.status(200).json(createResponse(null));
};

export const updateUsername = async (
  req: Request<unknown, ResponseBody, UpdateUsername>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { newUsername } = req.body;

  res.status(400);

  await UserService.updateUsername(currentUserId, newUsername);

  res.status(200).json(createResponse({ newUsername }));
};

export const updateEmail = async (
  req: Request<unknown, ResponseBody, UpdateEmail>,
  res: Response<ResponseBody>
) => {
  // verify new email
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { newEmail } = req.body;

  res.status(400);

  await UserService.updateEmail(currentUserId, newEmail);

  res.status(200).json(createResponse({ newEmail }));
};

export const deleteOne = async (req: Request, res: Response<ResponseBody>) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;

  res.status(400);

  await UserService.deleteOne(currentUserId);

  res.status(200).json(createResponse(null));
};

// export const confirmCurrentUserPassword: Handler = async (req, res) => {
//   const { password } = req.body;

//   const currentUser = await User.findById(req.currentUserId);
//   if (!currentUser) {
// res.status(400);
//     throw new Error('Sorry, we could not find your account');
//   }

//   const isPasswordMatch = await currentUser.isPasswordMatch(password);
//   if (!isPasswordMatch) {
// res.status(400);
//     throw new Error('Sorry, wrong password!');
//   }

//   res.status(200).json({ message: 'Password confirmed' });
// };
