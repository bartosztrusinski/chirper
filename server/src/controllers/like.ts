import { Handler } from 'express';
import { FilterQuery, PopulateOptions } from 'mongoose';
import { Chirp, IChirp } from '../models/Chirp';
import Like, { ILike } from '../models/Like';
import User, { IUser } from '../models/User';
import { BadRequestError } from '../utils/errors';

interface PopulatedUser {
  user: IUser;
}
interface PopulatedChirp {
  chirp: IChirp;
}

export const getLikingUsers: Handler = async (req, res) => {
  const { chirpId } = req.params;
  const { sinceId, userFields } = req.query;
  const limit = Math.min(
    Math.abs(parseInt(req.query.limit as string)) || 10,
    100
  );

  let filter: FilterQuery<ILike> = {
    chirp: chirpId,
  };
  filter = Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  const userSelect = userFields
    ? (userFields as string)
        .replace(/,/g, ' ')
        .replace(/__v|password|email/g, '')
        .trim()
    : '';

  const populate = {
    path: 'user',
    select: `${userSelect} username`,
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

export const getLikedChirps: Handler = async (req, res) => {
  const { username } = req.params;
  const { sinceId, userFields, chirpFields, expandAuthor } = req.query;
  const limit = Math.min(
    Math.abs(parseInt(req.query.limit as string)) || 10,
    20
  );

  const existingUser = await User.exists({ username });
  if (!existingUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to like'
    );
  }

  let filter: FilterQuery<ILike> = {
    user: existingUser._id,
  };
  filter = Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  const chirpSelect = chirpFields
    ? (chirpFields as string).replace(/,/g, ' ').replace(/__v/g, '').trim()
    : '';

  const userSelect = userFields
    ? (userFields as string)
        .replace(/,/g, ' ')
        .replace(/__v|password|email/g, '')
        .trim()
    : '';

  const populateAuthor: PopulateOptions | string[] = expandAuthor
    ? { path: 'author', select: `${userSelect} username` }
    : [];

  const populateChirp = {
    path: 'chirp',
    select: `${chirpSelect} content ${expandAuthor ? 'author' : ''}`,
    populate: populateAuthor,
  };

  const likes = await Like.find(filter)
    .populate<PopulatedChirp>(populateChirp)
    .sort({ _id: -1 })
    .limit(limit);

  const likedChirps = likes.map((like) => like.chirp);
  const oldestId = likes[likes.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ status: 'success', data: likedChirps, meta });
};

export const likeChirp: Handler = async (req, res) => {
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

export const unlikeChirp: Handler = async (req, res) => {
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
