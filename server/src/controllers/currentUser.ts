import { Request, Response } from 'express';
import User from '../models/User';
import {
  UpdateEmail,
  UpdatePassword,
  UpdateUsername,
  UserProfile,
  FindOne,
} from '../schemas/currentUser';
import { ResponseBody } from '../schemas';
import * as User2 from '../services/user';
import * as CurrentUser2 from '../services/currentUser';

export const getOne = async (
  req: Request<unknown, ResponseBody, unknown, FindOne>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { userFields } = req.query;

  res.status(400);
  if (!currentUserId) {
    throw new Error('Sorry, we could not find your account');
  }

  // const currentUser = await User.findById(currentUserId).select(userFields);
  const currentUser = await User2.findOne(currentUserId, userFields);

  // if (!currentUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }

  res.status(200).json({ data: currentUser });
};

export const updateProfile = async (
  req: Request<unknown, ResponseBody, UserProfile>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { name, picture, header, bio, location, website } = req.body;

  //   res.status(400);
  // const currentUser = await User.findById(currentUserId);
  // if (!currentUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }

  // currentUser.profile = {
  //   name,
  //   picture,
  //   header,
  //   bio,
  //   location,
  //   website,
  // };
  res.status(400);
  if (!currentUserId) {
    throw new Error('Sorry, we could not find your account');
  }

  const profile = {
    name,
    picture,
    header,
    bio,
    location,
    website,
  };
  // const updatedUser = await currentUser.save();
  const updatedProfile = await CurrentUser2.updateProfile(
    currentUserId,
    profile
  );

  res.status(200).json({ data: updatedProfile });
};

export const updatePassword = async (
  req: Request<unknown, ResponseBody, UpdatePassword>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { newPassword } = req.body;

  // const currentUser = await User.findById(currentUserId);
  // if (!currentUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }

  res.status(400);
  if (!currentUserId) {
    throw new Error('Sorry, we could not find your account');
  }

  // currentUser.password = newPassword;
  // await currentUser.save();
  await CurrentUser2.updatePassword(currentUserId, newPassword);

  res.status(200).json({ data: null });
};

export const updateUsername = async (
  req: Request<unknown, ResponseBody, UpdateUsername>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { newUsername } = req.body;

  // const currentUser = await User.findById(currentUserId);
  // if (!currentUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }

  res.status(400);
  if (!currentUserId) {
    throw new Error('Sorry, we could not find your account');
  }

  // currentUser.username = newUsername;
  // await currentUser.save();
  await CurrentUser2.updateUsername(currentUserId, newUsername);

  res.status(200).json({ data: { newUsername } });
};

export const updateEmail = async (
  req: Request<unknown, ResponseBody, UpdateEmail>,
  res: Response<ResponseBody>
) => {
  // verify new email
  const { currentUserId } = req;
  const { newEmail } = req.body;

  // const currentUser = await User.findById(currentUserId);
  // if (!currentUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }
  res.status(400);
  if (!currentUserId) {
    throw new Error('Sorry, we could not find your account');
  }

  // currentUser.email = newEmail;
  // await currentUser.save();
  await CurrentUser2.updateEmail(currentUserId, newEmail);

  res.status(200).json({ data: { newEmail } });
};

export const deleteOne = async (req: Request, res: Response<ResponseBody>) => {
  const { currentUserId } = req;

  res.status(400);
  if (!currentUserId) {
    throw new Error('Sorry, we could not find your account');
  }

  // const currentUser = await User.findById(currentUserId);
  // if (!currentUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }

  // await currentUser.remove();
  await CurrentUser2.deleteOne(currentUserId);

  res.status(200).json({ data: null });
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
