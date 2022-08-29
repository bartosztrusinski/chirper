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

  const currentUser = await User.exists({ _id: currentUserId });
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const likedChirp = await Chirp.exists({ _id: chirpId });
  if (!likedChirp) {
    throw new BadRequestError(
      'Sorry, we could not find the chirp you are trying to unlike'
    );
  }

  const like = await Like.findOneAndDelete({
    user: currentUser._id,
    chirp: likedChirp._id,
  });

  res.status(200).json({ liked: !like });
};

export const getLikingUsers: Handler = async (req, res) => {
  const { chirpId } = req.params;

  const likes = await Like.find({ chirp: chirpId }).populate<PopulatedUser>({
    path: 'user',
    select: '_id username profile.name',
  });

  const likingUsers = likes.map(({ user }) => user);

  res.status(200).json(likingUsers);
};

export const getLikedChirps: Handler = async (req, res) => {
  const { username } = req.params;

  const existingUser = await User.exists({ username });
  if (!existingUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to like'
    );
  }

  const likes = await Like.find({
    user: existingUser._id,
  }).populate<PopulatedChirp>({
    path: 'chirp',
    select: 'content',
  });

  const likedChirps = likes.map(({ chirp: { content } }) => content);

  res.status(200).json(likedChirps);
};
