import { Handler } from 'express';
import { Chirp } from '../../models/Chirp';
import Follow from '../../models/Follow';
import User from '../../models/User';
import { BadRequestError } from '../../utils/errors';

export const getUserChirps: Handler = async (req, res) => {
  const { username } = req.params;
  const { query } = req;
  const { lastCreated, limit } = query;

  const chirpsAuthor = await User.findOne({ username });
  if (!chirpsAuthor) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  const chirpQuery = { ...query, author: chirpsAuthor._id };

  const foundUsersChirps = await Chirp.find({
    ...chirpQuery,
    createdAt: { $lt: lastCreated || Date.now() },
  })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 10, 100));

  res.status(200).json(foundUsersChirps);
};

export const deleteChirp: Handler = async (req, res) => {
  const { chirpId } = req.params;

  const foundPost = await Chirp.findById(chirpId);
  if (!foundPost) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  const deletedChirp = await foundPost.remove();
  res.status(200).json(deletedChirp._id);
};

export const getReverseChronologicalTimeline: Handler = async (req, res) => {
  const { username } = req.params;
  const { lastCreated, limit } = req.query;

  const timelineUser = await User.exists({ username });
  if (!timelineUser) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  const follows = await Follow.find({ sourceUser: timelineUser._id });

  const following = follows.map(({ targetUser }) => targetUser);

  const timelineChirpsAuthors = [...following, timelineUser._id];

  const timelineChirps = await Chirp.find({
    author: { $in: timelineChirpsAuthors },
    createdAt: { $lt: lastCreated || Date.now() },
  })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 10, 100));

  res.status(200).json(timelineChirps);
};
