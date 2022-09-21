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

  const targetUserId = await UserService.exists(username);

  await FollowService.handleDuplicate(currentUserId, targetUserId);

  if (currentUserId.equals(targetUserId)) {
    throw new Error('Sorry, you cannot follow yourself');
  }

  await FollowService.createOne(currentUserId, targetUserId);

  res.status(200).json({ data: null });
};

export const deleteOne = async (
  req: Request<UsernameInput>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { username } = req.params;

  res.status(400);

  const targetUserId = await UserService.exists(username);
  await FollowService.deleteOne(currentUserId, targetUserId);

  res.status(200).json({ data: null });
};
