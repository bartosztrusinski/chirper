import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { ChirpId, Username } from '../schemas';
import { Chirp, IChirp } from '../models/Chirp';
import Like, { ILike } from '../models/Like';
import User, { IUser } from '../models/User';
import { GetLikedChirpsQuery, GetLikingUsersQuery } from '../schemas/like';
import { BadRequestError } from '../utils/errors';

interface PopulatedUser {
  user: IUser;
}
interface PopulatedChirp {
  chirp: IChirp;
}

export const getLikingUsers = async (
  req: Request<
    ChirpId,
    { status: string; data: object; meta: object },
    unknown,
    GetLikingUsersQuery
  >,
  res: Response<{ status: string; data: object; meta: object }>
) => {
  const { chirpId } = req.params;
  const { sinceId, userFields, limit } = req.query;

  const filter: FilterQuery<ILike> = {
    chirp: chirpId,
  };
  Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  const populate = {
    path: 'user',
    select: userFields,
  };

  const likes = await Like.find(filter)
    .populate<PopulatedUser>(populate)
    .sort({ _id: -1 })
    .limit(limit);

  const likingUsers = likes.map((like) => like.user);
  const oldestId = likes[likes.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ status: 'success', data: likingUsers, meta });
};

export const getLikedChirps = async (
  req: Request<
    Username,
    { status: string; data: object; meta: object },
    unknown,
    GetLikedChirpsQuery
  >,
  res: Response<{ status: string; data: object; meta: object }>
) => {
  const { username } = req.params;
  const { sinceId, userFields, chirpFields, expandAuthor, limit } = req.query;

  const existingUser = await User.exists({ username });
  if (!existingUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to like'
    );
  }

  const filter: FilterQuery<ILike> = {
    user: existingUser._id,
  };
  Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  const populateAuthor = { path: 'author', select: userFields };
  const populateChirp = {
    path: 'chirp',
    select: chirpFields,
    populate: populateAuthor,
  };
  Object.assign(populateChirp, expandAuthor && { populate: populateAuthor });

  const likes = await Like.find(filter)
    .populate<PopulatedChirp>(populateChirp)
    .sort({ _id: -1 })
    .limit(limit);

  const likedChirps = likes.map((like) => like.chirp);
  const oldestId = likes[likes.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ status: 'success', data: likedChirps, meta });
};

export const likeChirp = async (
  req: Request<unknown, { status: string; data: object }, ChirpId>,
  res: Response<{ status: string; data: object }>
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

export const unlikeChirp = async (
  req: Request<ChirpId>,
  res: Response<{ status: string; data: null }>
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
