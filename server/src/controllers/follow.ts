import { Request, Response } from 'express';
import { UsernameInput, ResponseBody } from '../schemas';
import Follow from '../models/Follow';
import User from '../models/User';
import { BadRequestError } from '../utils/errors';

export const createOne = async (
  req: Request<unknown, ResponseBody, UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { username } = req.body;

  const currentUser = await User.exists({ _id: currentUserId });
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const targetUser = await User.exists({ username });
  if (!targetUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to follow'
    );
  }

  if (currentUser._id.equals(targetUser._id)) {
    throw new BadRequestError('Sorry, you cannot follow yourself');
  }

  const newFollow = await Follow.create({
    sourceUser: currentUser._id,
    targetUser: targetUser._id,
  });

  res.status(200).json({ status: 'success', data: null });
};

export const deleteOne = async (
  req: Request<UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { username } = req.params;

  const followedUser = await User.exists({ username });
  if (!followedUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to unfollow'
    );
  }

  const foundFollow = await Follow.findOne({
    sourceUser: currentUserId,
    targetUser: followedUser._id,
  });
  if (!foundFollow) {
    throw new BadRequestError('You are not following this user');
  }

  await foundFollow.remove();

  res.status(200).json({ status: 'success', data: null });
};
