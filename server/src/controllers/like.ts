import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ChirpId, ResponseBody } from '../schemas';
import * as ChirpService from '../services/chirp';
import * as LikeService from '../services/like';

export const createOne = async (
  req: Request<unknown, ResponseBody, ChirpId>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { chirpId } = req.body;

  res.status(400);

  await LikeService.handleDuplicate(currentUserId, chirpId);

  const existingChirp = await ChirpService.findOne(chirpId);

  await LikeService.createOne(currentUserId, existingChirp._id);

  res.status(200).json({ data: null });
};

export const deleteOne = async (
  req: Request<ChirpId>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { chirpId } = req.params;

  res.status(400);

  await LikeService.deleteOne(currentUserId, chirpId);

  res.status(200).json({ data: null });
};
