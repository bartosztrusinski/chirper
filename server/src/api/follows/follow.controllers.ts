import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { SuccessResponse, UsernameObject } from '../../interfaces/general';
import * as FollowService from './follow.service';
import * as UserService from '../users/user.service';

export const createOne = async (
  req: Request<unknown, SuccessResponse, UsernameObject>,
  res: Response<SuccessResponse>
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
  req: Request<UsernameObject>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { username } = req.params;

  res.status(400);

  const targetUser = await UserService.findOne(username);
  await FollowService.deleteOne(currentUserId, targetUser._id);

  res.status(200).json({ data: null });
};
