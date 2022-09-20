import { Request, Response } from 'express';
import { UsernameInput, ResponseBody } from '../schemas';
import Follow from '../models/Follow';
import User from '../models/User';
import * as Follow2 from '../services/follow';
import * as User2 from '../services/user';
import { Types } from 'mongoose';

export const createOne = async (
  req: Request<unknown, ResponseBody, UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { username } = req.body;

  res.status(400);
  if (!currentUserId) {
    throw new Error('You must be logged in to follow a user');
  }
  // const currentUser = await User.exists({ _id: currentUserId });
  // if (!currentUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }

  // const currentUser = await User2.exists(currentUserId); // delete, in middleware

  // const targetUser = await User.exists({ username });
  // if (!targetUser) {
  //   res.status(400);
  //   throw new Error(
  //     'Sorry, we could not find the user you are trying to follow'
  //   );
  // }
  const targetUserId = await User2.exists(username);

  if (currentUserId.equals(targetUserId)) {
    // res.status(400);
    throw new Error('Sorry, you cannot follow yourself');
  }

  // const newFollow = await Follow.create({
  //   sourceUser: currentUser._id,
  //   targetUser: targetUser._id,
  // });
  await Follow2.createOne(currentUserId, targetUserId);

  res.status(200).json({ data: null });
};

export const deleteOne = async (
  req: Request<UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { username } = req.params;

  if (!currentUserId) {
    throw new Error('You must be logged in to follow a user');
  }
  // const followedUser = await User.exists({ username });
  // if (!followedUser) {
  //   res.status(400);
  //   throw new Error(
  //     'Sorry, we could not find the user you are trying to unfollow'
  //   );
  // }
  const targetUserId = await User2.exists(username);

  // const foundFollow = await Follow.findOne({
  //   sourceUser: currentUserId,
  //   targetUser: targetUserId,
  // });
  // if (!foundFollow) {
  //   res.status(400);
  //   throw new Error('You are not following this user');
  // }

  // await foundFollow.remove();
  await Follow2.deleteOne(currentUserId, targetUserId);

  res.status(200).json({ data: null });
};
