import { Handler } from 'express';
import { FilterQuery, SortOrder, Types } from 'mongoose';
import { Chirp, IChirp } from '../../models/Chirp';
import Follow from '../../models/Follow';
import User from '../../models/User';
import { BadRequestError } from '../../utils/errors';

export const getUserChirps: Handler = async (req, res) => {
  const { username } = req.params;
  const { query, lastId, limit } = req.query;
  const reqLimit = Math.min(Number(limit) || 10, 20);

  let nextPageQuery = {};
  if (lastId) {
    nextPageQuery = { _id: { $lt: lastId } };
  }

  const chirpsAuthor = await User.findOne({ username });
  if (!chirpsAuthor) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  // const chirpQuery = { query as string, author: chirpsAuthor._id };

  const foundUsersChirps = await Chirp.find({
    author: chirpsAuthor._id,
    ...nextPageQuery,
  })
    .sort({ _id: -1 })
    .limit(reqLimit);

  res.status(200).json(foundUsersChirps);
};

export const searchChirps: Handler = async (req, res) => {
  const { query, followingOnly, sortBy, from, includeReplies, since, until } =
    req.query;

  if (!query) {
    throw new BadRequestError('Query is required');
  }

  const limit = Math.min(
    Math.abs(parseInt(req.query.limit as string)) || 10,
    20
  );
  const page = Math.abs(parseInt(req.query.page as string) || 1);
  const skip = (page - 1) * limit;
  const projection = { score: { $meta: 'textScore' }, content: 1 }; // delete score later

  let sort: { [key: string]: SortOrder | { $meta: 'textScore' } } = {
    score: { $meta: 'textScore' },
  };
  if (sortBy === 'recent') {
    sort = { createdAt: -1 };
  } else if (sortBy === 'popular') {
    sort = { 'metrics.likeCount': -1 };
  }

  let filter: FilterQuery<IChirp> = {
    $text: { $search: query as string },
    kind: includeReplies ? '' : 'post',
  };

  if (followingOnly) {
    if (!req.currentUserId) {
      throw new BadRequestError('You must be logged in to do that');
    }
    const follows = await Follow.find({ sourceUser: req.currentUserId });
    const followingIds = follows.map((follow) => follow.targetUser);
    filter = { ...filter, author: followingIds };
  }

  if (from) {
    const fromUser = await User.exists({ username: from });
    if (!fromUser) {
      throw new BadRequestError('Sorry, we could not find that user');
    }
    filter = { ...filter, author: fromUser._id };
  }

  let createdAt: Record<string, unknown> = {
    $gte: typeof since === 'string' ? new Date(since) : '',
    $lte: typeof until === 'string' ? new Date(until) : '',
  };
  createdAt = Object.fromEntries(
    Object.entries(createdAt).filter(([_, v]) => v !== '')
  );
  filter = { ...filter, createdAt };

  filter = Object.fromEntries(
    Object.entries(filter).filter(
      ([_, v]) =>
        v !== '' &&
        v != null &&
        (v instanceof Types.ObjectId || Object.keys(v).length)
    )
  );

  const chirps = await Chirp.find(filter)
    .select(projection)
    .sort(sort)
    .skip(skip) // not the best way to do this
    .limit(limit);

  res.status(200).json(chirps);
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
  const { lastId, limit } = req.query;
  const reqLimit = Math.min(Number(limit) || 10, 20);

  let nextPageQuery = {};
  if (lastId) {
    nextPageQuery = { _id: { $lt: lastId } };
  }

  const timelineUser = await User.exists({ username });
  if (!timelineUser) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  const follows = await Follow.find({ sourceUser: timelineUser._id });
  const following = follows.map(({ targetUser }) => targetUser);
  const timelineChirpsAuthors = [...following, timelineUser._id];

  const timelineChirps = await Chirp.find({
    author: { $in: timelineChirpsAuthors },
    ...nextPageQuery,
  })
    .sort({ _id: -1 })
    .limit(reqLimit);

  res.status(200).json(timelineChirps);
};
