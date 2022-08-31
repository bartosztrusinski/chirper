import { Handler } from 'express';
import User from '../models/User';
import { BadRequestError } from '../utils/errors';

export const getCurrentUser: Handler = async (req, res) => {
  const currentUser = await User.findById(req.currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const { _id, username, email, profile } = currentUser;

  res.status(200).json({ _id, username, email, profile });
};

export const updateCurrentUserProfile: Handler = async (req, res) => {
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

  res.status(200).json(updatedUser);
};

export const updateCurrentUserPassword: Handler = async (req, res) => {
  const { currentUserId } = req;
  const { newPassword } = req.body;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  currentUser.password = newPassword;
  const updatedUser = await currentUser.save();

  res.status(200).json(updatedUser);
};

export const updateCurrentUserUsername: Handler = async (req, res) => {
  const { currentUserId } = req;
  const { newUsername } = req.body;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  currentUser.username = newUsername;
  const updatedUser = await currentUser.save();

  res.status(200).json(updatedUser);
};

export const updateCurrentUserEmail: Handler = async (req, res) => {
  // verify new email
  const { currentUserId } = req;
  const { newEmail } = req.body;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  currentUser.email = newEmail;
  const updatedUser = await currentUser.save();

  res.status(200).json(updatedUser);
};

export const deleteCurrentUser: Handler = async (req, res) => {
  const { currentUserId } = req;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  await currentUser.remove();

  res.status(200).json({ message: 'Account deleted' });
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
