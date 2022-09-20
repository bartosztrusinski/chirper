import { Request, Response } from 'express';
import Chirp from '../models/Chirp';
import Like from '../models/Like';
import User from '../models/User';
import { ChirpId, ResponseBody } from '../schemas';
import * as Chirp2 from '../services/chirp';
import * as Like2 from '../services/like';

export const createOne = async (
  req: Request<unknown, ResponseBody, ChirpId>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { chirpId } = req.body;

  res.status(400);
  if (!currentUserId) {
    throw new Error('You must be logged in to like a chirp');
  }

  // const currentUser = await User.exists({ _id: currentUserId });
  // if (!currentUser) {
  //   res.status(400);
  //   throw new Error('Sorry, we could not find your account');
  // }

  // const likedChirp = await Chirp.exists({ _id: chirpId });
  // if (!likedChirp) {
  //   res.status(400);
  //   throw new Error(
  //     'Sorry, we could not find the chirp you are trying to like'
  //   );
  // }

  const likedChirp = await Chirp2.findOne(chirpId);

  // const like = await Like.create({
  //   user: currentUserId,
  //   chirp: likedChirp._id,
  // });
  await Like2.createOne(currentUserId, likedChirp._id);

  res.status(200).json({ data: null });
};

export const deleteOne = async (
  req: Request<ChirpId>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { chirpId } = req.params;

  res.status(400);
  if (!currentUserId) {
    throw new Error('You must be logged in to like a chirp');
  }
  // const foundLike = await Like.findOne({
  //   user: currentUserId,
  //   chirp: chirpId,
  // });
  // if (!foundLike) {
  //   res.status(400);
  //   throw new Error('You have not liked this chirp');
  // }

  // await foundLike.remove();
  await Like2.deleteOne(currentUserId, chirpId);

  res.status(200).json({ data: null });
};
