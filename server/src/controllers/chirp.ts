import { Handler } from 'express';
import { FilterQuery, PopulateOptions, SortOrder, Types } from 'mongoose';
import {
  Chirp,
  IChirp,
  IPost,
  IReply,
  PostChirp,
  ReplyChirp,
} from '../models/Chirp';
import Follow from '../models/Follow';
import User from '../models/User';
import { BadRequestError } from '../utils/errors';

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

  const filter: FilterQuery<IChirp> = {
    author: chirpsAuthor._id,
  };
  Object.assign(
    filter,
    sinceId && { _id: { $lt: sinceId } },
    includeReplies !== 'true' && { kind: 'post' }
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

export const getChirps: Handler = async (req, res) => {
  const { ids, userFields, chirpFields, expandAuthor } = req.query;

  if (ids instanceof Array && ids.length > 100) {
    throw new BadRequestError(
      'Sorry, you can only request up to 100 chirps at a time'
    );
  }

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

  const foundChirps = await Chirp.find({ _id: ids })
    .select(`${chirpSelect} content ${expandAuthor ? 'author' : ''}`)
    .populate(populate);

  res.status(200).json({ status: 'success', data: foundChirps });
};

export const getChirp: Handler = async (req, res) => {
  const { chirpId } = req.params;
  const { userFields, chirpFields, expandAuthor } = req.query;

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

  const foundChirp = await Chirp.findById(chirpId)
    .select(`${chirpSelect} content ${expandAuthor ? 'author' : ''}`)
    .populate(populate);

  if (!foundChirp) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  res.status(200).json({ status: 'success', data: foundChirp });
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

  let filter: FilterQuery<IChirp> = {
    $text: { $search: query as string },
  };
  Object.assign(filter, includeReplies !== 'true' && { kind: 'post' });

  if (followingOnly) {
    if (!req.currentUserId) {
      throw new BadRequestError('You must be logged in to do that');
    }
    const follows = await Follow.find({ sourceUser: req.currentUserId });
    const followingIds = follows.map((follow) => follow.targetUser);
    filter = { ...filter, author: followingIds };
  } else if (from) {
    const fromUser = await User.exists({ username: from });
    if (!fromUser) {
      throw new BadRequestError('Sorry, we could not find that user');
    }
    filter = { ...filter, author: fromUser._id };
  }

  const createdAt = Object.assign(
    {},
    typeof startTime === 'string' && { $gte: new Date(startTime) },
    typeof endTime === 'string' && { $lte: new Date(endTime) }
  );
  Object.assign(filter, Object.keys(createdAt).length && { createdAt });

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
  const followingIds = follows.map((follow) => follow.targetUser);
  const timelineChirpsAuthors = [...followingIds, timelineUser._id];

  const filter: FilterQuery<IChirp> = {
    author: timelineChirpsAuthors,
  };
  Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

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

export const createChirp: Handler = async (req, res) => {
  const { currentUserId } = req;
  const { content, isReply } = req.body;

  if (!currentUserId) {
    throw new BadRequestError('Sorry, you must be logged in to chirp');
  }

  const chirp = isReply
    ? await createReply(currentUserId, content, req.body.chirpId)
    : await createPost(currentUserId, content);

  res.status(200).json({ status: 'success', data: chirp });
};

const createReply = async (
  userId: Types.ObjectId,
  content: string,
  parentId: Types.ObjectId
) => {
  const parentChirp = await Chirp.findById(parentId);
  if (!parentChirp) {
    throw new BadRequestError(
      'Sorry, we could not find chirp you are replying to'
    );
  }

  const parent = parentChirp._id;
  const post = parentChirp instanceof ReplyChirp ? parentChirp.post : parent;

  const newReply = await ReplyChirp.create<Omit<IReply, 'metrics' | 'replies'>>(
    {
      content,
      author: userId,
      post,
      parent,
    }
  );
  return newReply;
};

const createPost = async (userId: Types.ObjectId, content: string) => {
  const newPost = await PostChirp.create<Omit<IPost, 'metrics' | 'replies'>>({
    content,
    author: userId,
  });
  return newPost;
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
