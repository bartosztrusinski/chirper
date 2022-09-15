import { Request, Response } from 'express';
import { FilterQuery, SortOrder, Types } from 'mongoose';
import { ChirpId, UsernameInput, ResponseBody } from '../schemas';
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
import {
  CreateChirp,
  GetChirp,
  GetChirps,
  ReverseChronologicalTimeline,
  SearchChirps,
} from '../schemas/chirp';
import { GetUserChirps } from '../schemas/user';
import { BadRequestError } from '../utils/errors';

export const getChirps = async (
  req: Request<unknown, ResponseBody, unknown, GetChirps>,
  res: Response<ResponseBody>
) => {
  const { ids, userFields, chirpFields, expandAuthor } = req.query;

  const populate = expandAuthor ? [{ path: 'author', select: userFields }] : [];

  const foundChirps = await Chirp.find({ _id: ids })
    .select(chirpFields)
    .populate(populate);

  res.status(200).json({ status: 'success', data: foundChirps });
};

export const getChirp = async (
  req: Request<ChirpId, ResponseBody, unknown, GetChirp>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;
  const { userFields, chirpFields, expandAuthor } = req.query;

  const populate = expandAuthor ? [{ path: 'author', select: userFields }] : [];

  const foundChirp = await Chirp.findById(chirpId)
    .select(chirpFields)
    .populate(populate);

  if (!foundChirp) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  res.status(200).json({ status: 'success', data: foundChirp });
};

export const searchChirps = async (
  req: Request<unknown, ResponseBody, unknown, SearchChirps>,
  res: Response<ResponseBody>
) => {
  const {
    query,
    from,
    followingOnly,
    includeReplies,
    expandAuthor,
    chirpFields,
    userFields,
    sortOrder,
    startTime,
    endTime,
    page,
    limit,
  } = req.query;

  let filter: FilterQuery<IChirp> = {
    $text: { $search: query },
  };
  Object.assign(filter, !includeReplies && { kind: 'post' });

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

  const createdAt = Object.assign(
    {},
    startTime && { $gte: startTime },
    endTime && { $lte: endTime }
  );
  Object.assign(filter, Object.keys(createdAt).length && { createdAt });

  const populate = expandAuthor ? [{ path: 'author', select: userFields }] : [];

  const sortBy: {
    [key: string]: { [key: string]: SortOrder | { $meta: 'textScore' } };
  } = {
    recent: { createdAt: -1 },
    popular: { 'metrics.likeCount': -1 },
    relevant: { score: { $meta: 'textScore' } },
  };
  const sort = sortBy[sortOrder];

  const skip = (page - 1) * limit;

  const foundChirps = await Chirp.find(filter)
    .select(chirpFields)
    .select({ score: { $meta: 'textScore' } }) // delete score later
    .populate(populate)
    .sort(sort)
    .skip(skip) // not the best way to do this
    .limit(limit);

  res.status(200).json({ status: 'success', data: foundChirps });
};

export const getReverseChronologicalTimeline = async (
  req: Request<
    UsernameInput,
    ResponseBody,
    unknown,
    ReverseChronologicalTimeline
  >,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, expandAuthor, chirpFields, userFields, limit } = req.query;

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

  const populate = expandAuthor ? [{ path: 'author', select: userFields }] : [];

  const timelineChirps = await Chirp.find(filter)
    .select(chirpFields)
    .populate(populate)
    .sort({ _id: -1 })
    .limit(limit);

  res.status(200).json({ status: 'success', data: timelineChirps });
};

export const getUserChirps = async (
  req: Request<UsernameInput, ResponseBody, unknown, GetUserChirps>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const {
    sinceId,
    includeReplies,
    userFields,
    chirpFields,
    expandAuthor,
    limit,
  } = req.query;

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
    !includeReplies && { kind: 'post' }
  );

  const populate = expandAuthor ? [{ path: 'author', select: userFields }] : [];

  const foundUsersChirps = await Chirp.find(filter)
    .select(chirpFields)
    .populate(populate)
    .sort({ _id: -1 })
    .limit(limit);

  res.status(200).json({ status: 'success', data: foundUsersChirps });
};

export const createChirp = async (
  req: Request<unknown, ResponseBody, CreateChirp>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { content, isReply, chirpId } = req.body;

  if (!currentUserId) {
    throw new BadRequestError('Sorry, you must be logged in to chirp');
  }

  const chirp = isReply
    ? await createReply(currentUserId, content, chirpId)
    : await createPost(currentUserId, content);

  res.status(200).json({ status: 'success', data: chirp });
};

const createReply = async (
  userId: Types.ObjectId,
  content: string,
  parentId: Types.ObjectId | undefined
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

export const deleteChirp = async (
  req: Request<ChirpId>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;

  const foundPost = await Chirp.findById(chirpId);
  if (!foundPost) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  await foundPost.remove();

  res.status(200).json({ status: 'success', data: null });
};
