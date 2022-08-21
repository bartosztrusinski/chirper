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

// update user profile

// update user password

// update user email

// update user username

// delete user
