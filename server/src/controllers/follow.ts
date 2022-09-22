import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { UsernameInput, ResponseBody } from '../schemas';
import * as FollowService from '../services/follow';
import * as UserService from '../services/user';

export const createOne = async (
  req: Request<unknown, ResponseBody, UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { username } = req.body;

  res.status(400);

  const targetUser = await UserService.findOne(username);

  await FollowService.handleDuplicate(currentUserId, targetUser._id);

  if (currentUserId.equals(targetUser._id)) {
    throw new Error('Sorry, you cannot follow yourself');
  }

  await FollowService.createOne(currentUserId, targetUser._id);

  res.status(200).json({ data: null });
};

export const deleteOne = async (
  req: Request<UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { username } = req.params;

  res.status(400);

  const targetUser = await UserService.findOne(username);
  await FollowService.deleteOne(currentUserId, targetUser._id);

  res.status(200).json({ data: null });
};
