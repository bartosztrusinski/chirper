import { Handler } from 'express';
import { Chirp, IChirp } from '../models/Chirp';
import Like from '../models/Like';
import User, { IUser } from '../models/User';
import { BadRequestError } from '../utils/errors';

interface PopulatedUser {
  user: IUser;
}
interface PopulatedChirp {
  chirp: IChirp;
}

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

  res.status(200).json({ liked: Boolean(like) });
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

  const deletedLike = await foundLike.remove();

  res.status(200).json({ liked: !deletedLike });
};

export const getLikingUsers: Handler = async (req, res) => {
  const { chirpId } = req.params;
  const { lastId, limit } = req.query;
  const reqLimit = Math.min(Number(limit) || 10, 20);

  let nextPageQuery = {};
  if (lastId) {
    nextPageQuery = { _id: { $lt: lastId } };
  }

  const likes = await Like.find({
    chirp: chirpId,
    ...nextPageQuery,
  })
    .populate<PopulatedUser>({
      path: 'user',
      select: 'username profile.name',
    })
    .sort({ _id: -1 })
    .limit(reqLimit);

  const likingUsers = likes.map((like) => ({
    likeId: like._id,
    user: like.user,
  }));

  res.status(200).json(likingUsers);
};

export const getLikedChirps: Handler = async (req, res) => {
  const { username } = req.params;
  const { lastId, limit } = req.query;
  const reqLimit = Math.min(Number(limit) || 10, 20);

  let nextPageQuery = {};
  if (lastId) {
    nextPageQuery = { _id: { $lt: lastId } };
  }

  const existingUser = await User.exists({ username });
  if (!existingUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to like'
    );
  }

  const likes = await Like.find({
    user: existingUser._id,
    ...nextPageQuery,
  })
    .populate<PopulatedChirp>({
      path: 'chirp',
      select: 'content',
    })
    .sort({ _id: -1 })
    .limit(reqLimit);

  const likedChirps = likes.map((like) => ({
    likeId: like._id,
    chirp: like.chirp,
  }));

  res.status(200).json(likedChirps);
};
