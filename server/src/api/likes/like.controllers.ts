import { Request, Response } from 'express';
import { SuccessResponse } from '../../interfaces';
import { LikeControllers } from './like.interfaces';
import * as chirpService from '../chirps/chirp.service';
import * as likeService from './like.service';

const createOne = async (
  req: Request<{}, SuccessResponse, LikeControllers.CreateOne['body']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: LikeControllers.CreateOne['currentUserId'] }
  >req;
  const { chirpId } = req.body;

  res.status(400);

  await likeService.handleDuplicate(currentUserId, chirpId);

  const existingChirp = await chirpService.findOne(chirpId);

  await likeService.createOne(currentUserId, existingChirp._id);

  res.status(200).json({ data: null });
};

const deleteOne = async (
  req: Request<LikeControllers.DeleteOne['params']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: LikeControllers.DeleteOne['currentUserId'] }
  >req;
  const { chirpId } = req.params;

  res.status(400);

  await likeService.deleteOne(currentUserId, chirpId);

  res.status(200).json({ data: null });
};

export { createOne, deleteOne };
