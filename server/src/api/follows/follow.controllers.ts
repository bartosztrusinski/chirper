import { Request, Response } from 'express';
import { SuccessResponse } from '../../interfaces';
import { FollowControllers } from './follow.interfaces';
import * as followService from './follow.service';
import * as userService from '../users/user.service';

const createOne = async (
  req: Request<{}, SuccessResponse, FollowControllers.CreateOne['body']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: FollowControllers.CreateOne['currentUserId'] }
  >req;
  const { username } = req.body;

  res.status(400);

  const targetUser = await userService.findOne(username);

  await followService.handleDuplicate(currentUserId, targetUser._id);

  if (currentUserId.equals(targetUser._id)) {
    throw new Error('Sorry, you cannot follow yourself');
  }

  await followService.createOne(currentUserId, targetUser._id);

  res.status(200).json({ data: null });
};

const deleteOne = async (
  req: Request<FollowControllers.DeleteOne['params']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: FollowControllers.DeleteOne['currentUserId'] }
  >req;
  const { username } = req.params;

  res.status(400);

  const targetUser = await userService.findOne(username);
  await followService.deleteOne(currentUserId, targetUser._id);

  res.status(200).json({ data: null });
};

export { createOne, deleteOne };
