import { Handler } from 'express';
import { FilterQuery, PopulateOptions, SortOrder, Types } from 'mongoose';
import { Chirp, IChirp } from '../../models/Chirp';
import Follow from '../../models/Follow';
import User from '../../models/User';
import { BadRequestError } from '../../utils/errors';

export const getUserChirps: Handler = async (req, res) => {
  const { username } = req.params;
  const { sinceId, includeReplies, userFields, chirpFields, expandAuthor } =
    req.query;

  const limit = Math.min(
    Math.abs(parseInt(req.query.limit as string)) || 10,
    20
  );

  const chirpsAuthor = await User.exists({ username });
  if (!chirpsAuthor) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  let filter: FilterQuery<IChirp> = {
    author: chirpsAuthor._id,
    kind: includeReplies ? '' : 'post',
    _id: sinceId ? { $lt: sinceId } : '',
  };
  filter = Object.fromEntries(
    Object.entries(filter).filter(([_, v]) => v !== '')
  );

  const chirpSelect = chirpFields
    ? (chirpFields as string).replace(/,/g, ' ').replace(/__v/g, '').trim()
    : '';

  const userSelect = userFields
    ? (userFields as string)
        .replace(/,/g, ' ')
        .replace(/__v|password|email/g, '')
        .trim()
    : '';

  const populate: PopulateOptions | string[] = expandAuthor
    ? { path: 'author', select: `${userSelect} username` }
    : [];

  const foundUsersChirps = await Chirp.find(filter)
    .select(`${chirpSelect} content ${expandAuthor ? 'author' : ''}`)
    .populate(populate)
    .sort({ _id: -1 })
    .limit(limit);

  res.status(200).json({ status: 'success', data: foundUsersChirps });
};

export const searchChirps: Handler = async (req, res) => {
  const {
    query,
    followingOnly,
    sortBy,
    from,
    includeReplies,
    startTime,
    endTime,
    chirpFields,
    userFields,
    expandAuthor,
  } = req.query;

  if (!query) {
    throw new BadRequestError('Query is required');
  }

  const limit = Math.min(
    Math.abs(parseInt(req.query.limit as string)) || 10,
    20
  );
  const page = Math.abs(parseInt(req.query.page as string) || 1);
  const skip = (page - 1) * limit;

  const chirpSelect = chirpFields
    ? (chirpFields as string).replace(/,/g, ' ').replace(/__v/g, '').trim()
    : '';

  const userSelect = userFields
    ? (userFields as string)
        .replace(/,/g, ' ')
        .replace(/__v|password|email/g, '')
        .trim()
    : '';

  const populate: PopulateOptions | string[] = expandAuthor
    ? { path: 'author', select: `${userSelect} username` }
    : [];

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
    $gte: typeof startTime === 'string' ? new Date(startTime) : '',
    $lte: typeof endTime === 'string' ? new Date(endTime) : '',
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

  const foundChirps = await Chirp.find(filter)
    .select(`${chirpSelect} content ${expandAuthor ? 'author' : ''}`)
    .select({ score: { $meta: 'textScore' } }) // delete score later
    .populate(populate)
    .sort(sort)
    .skip(skip) // not the best way to do this
    .limit(limit);

  res.status(200).json({ status: 'success', data: foundChirps });
};

export const getReverseChronologicalTimeline: Handler = async (req, res) => {
  const { username } = req.params;
  const { sinceId, expandAuthor, chirpFields, userFields } = req.query;

  const limit = Math.min(
    Math.abs(parseInt(req.query.limit as string)) || 10,
    20
  );

  const timelineUser = await User.exists({ username });
  if (!timelineUser) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  const follows = await Follow.find({ sourceUser: timelineUser._id });
  const timelineChirpsAuthors = [
    ...follows.map((f) => f.targetUser),
    timelineUser._id,
  ];

  let filter: FilterQuery<IChirp> = {
    author: timelineChirpsAuthors,
    _id: sinceId ? { $lt: sinceId } : '',
  };
  filter = Object.fromEntries(
    Object.entries(filter).filter(([_, v]) => v !== '')
  );

  const chirpSelect = chirpFields
    ? (chirpFields as string).replace(/,/g, ' ').replace(/__v/g, '').trim()
    : '';

  const userSelect = userFields
    ? (userFields as string)
        .replace(/,/g, ' ')
        .replace(/__v|password|email/g, '')
        .trim()
    : '';

  const populate: PopulateOptions | string[] = expandAuthor
    ? { path: 'author', select: `${userSelect} username` }
    : [];

  const timelineChirps = await Chirp.find(filter)
    .select(`${chirpSelect} content ${expandAuthor ? 'author' : ''}`)
    .populate(populate)
    .sort({ _id: -1 })
    .limit(limit);

  res.status(200).json({ status: 'success', data: timelineChirps });
};

export const deleteChirp: Handler = async (req, res) => {
  const { chirpId } = req.params;

  const foundPost = await Chirp.findById(chirpId);
  if (!foundPost) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  await foundPost.remove();

  res.status(200).json({ status: 'success', data: null });
};
