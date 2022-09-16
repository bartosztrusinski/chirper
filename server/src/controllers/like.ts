import { Request, Response } from 'express';
import Chirp from '../models/Chirp';
import Like from '../models/Like';
import User from '../models/User';
import { ChirpId, ResponseBody } from '../schemas';
import { BadRequestError } from '../utils/errors';

export const createOne = async (
  req: Request<unknown, ResponseBody, ChirpId>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { chirpId } = req.body;

  const currentUser = await User.exists({ _id: currentUserId });
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const likedChirp = await Chirp.exists({ _id: chirpId });
  if (!likedChirp) {
    throw new BadRequestError(
      'Sorry, we could not find the chirp you are trying to like'
    );
  }

  const like = await Like.create({
    user: currentUser._id,
    chirp: likedChirp._id,
  });

  res.status(200).json({ status: 'success', data: like });
};

export const deleteOne = async (
  req: Request<ChirpId>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { chirpId } = req.params;

  const foundLike = await Like.findOne({
    user: currentUserId,
    chirp: chirpId,
  });
  if (!foundLike) {
    throw new BadRequestError('You have not liked this chirp');
  }

  await foundLike.remove();

  res.status(200).json({ status: 'success', data: null });
};
