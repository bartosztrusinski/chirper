import { Request, Response } from 'express';
import { FilterQuery, SortOrder, Types } from 'mongoose';
import Chirp, {
  IChirp,
  IPost,
  IReply,
  PostChirp,
  ReplyChirp,
} from '../models/Chirp';
import Like, { ILike } from '../models/Like';
import Follow from '../models/Follow';
import User from '../models/User';
import { ChirpId, UsernameInput, ResponseBody } from '../schemas';
import {
  CreateOne,
  FindOne,
  FindMany,
  GetUserTimeline,
  SearchMany,
  FindManyByUser,
  FindManyLiked,
} from '../schemas/chirp';

export const findMany = async (
  req: Request<unknown, ResponseBody, unknown, FindMany>,
  res: Response<ResponseBody>
) => {
  const { ids, userFields, chirpFields, expandAuthor } = req.query;

  const populate = expandAuthor ? [{ path: 'author', select: userFields }] : [];

  const foundChirps = await Chirp.find({ _id: ids })
    .select(chirpFields)
    .populate(populate);

  res.status(200).json({ data: foundChirps });
};

export const findOne = async (
  req: Request<ChirpId, ResponseBody, unknown, FindOne>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;
  const { userFields, chirpFields, expandAuthor } = req.query;

  const populate = expandAuthor ? [{ path: 'author', select: userFields }] : [];

  const foundChirp = await Chirp.findById(chirpId)
    .select(chirpFields)
    .populate(populate);

  if (!foundChirp) {
    res.status(400);
    throw new Error('Sorry, we could not find that chirp');
  }

  res.status(200).json({ data: foundChirp });
};

export const searchMany = async (
  req: Request<unknown, ResponseBody, unknown, SearchMany>,
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
      res.status(400);
      throw new Error('You must be logged in to do that');
    }
    const follows = await Follow.find({ sourceUser: req.currentUserId });
    const followingIds = follows.map((follow) => follow.targetUser);
    filter = { ...filter, author: followingIds };
  }

  if (from) {
    const fromUser = await User.exists({ username: from });
    if (!fromUser) {
      res.status(400);
      throw new Error('Sorry, we could not find that user');
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
  const sort = { ...sortBy[sortOrder], ...sortBy.relevant };

  const skip = (page - 1) * limit;

  const foundChirps = await Chirp.find(filter)
    .select(chirpFields)
    .select({ score: { $meta: 'textScore' } }) // delete score later
    .populate(populate)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({ data: foundChirps });
};

export const getUserTimeline = async (
  req: Request<UsernameInput, ResponseBody, unknown, GetUserTimeline>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, expandAuthor, chirpFields, userFields, limit } = req.query;

  const timelineUser = await User.exists({ username });
  if (!timelineUser) {
    res.status(400);
    throw new Error('Sorry, we could not find that user');
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

  res.status(200).json({ data: timelineChirps });
};

export const findManyByUser = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyByUser>,
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
    res.status(400);
    throw new Error('Sorry, we could not find that user');
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

  res.status(200).json({ data: foundUsersChirps });
};

export const createOne = async (
  req: Request<unknown, ResponseBody, CreateOne>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { content, isReply, chirpId } = req.body;

  if (!currentUserId) {
    res.status(400);
    throw new Error('Sorry, you must be logged in to chirp');
  }

  res.status(400);
  const newChirp = isReply
    ? await createReply(currentUserId, content, chirpId)
    : await createPost(currentUserId, content);

  res.status(200).json({ data: newChirp });
};

const createReply = async (
  userId: Types.ObjectId,
  content: string,
  parentId: Types.ObjectId | undefined
) => {
  const parentChirp = await Chirp.findById(parentId);
  if (!parentChirp) {
    throw new Error('Sorry, we could not find chirp you are replying to');
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
  return { _id: newReply._id };
};

const createPost = async (userId: Types.ObjectId, content: string) => {
  const newPost = await PostChirp.create<Omit<IPost, 'metrics' | 'replies'>>({
    content,
    author: userId,
  });
  return { _id: newPost._id };
};

export const deleteOne = async (
  req: Request<ChirpId>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;

  const foundPost = await Chirp.findById(chirpId);
  if (!foundPost) {
    res.status(400);
    throw new Error('Sorry, we could not find that chirp');
  }

  await foundPost.remove();

  res.status(200).json({ data: null });
};

export const findManyLiked = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyLiked>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, userFields, chirpFields, expandAuthor, limit } = req.query;

  const existingUser = await User.exists({ username });
  if (!existingUser) {
    res.status(400);
    throw new Error('Sorry, we could not find the user you are trying to like');
  }

  const filter: FilterQuery<ILike> = {
    user: existingUser._id,
  };
  Object.assign(filter, sinceId && { _id: { $lt: sinceId } });

  const populateChirp = { path: 'chirp', select: chirpFields };
  const populateAuthor = { path: 'author', select: userFields };
  Object.assign(populateChirp, expandAuthor && { populate: populateAuthor });

  const likes = await Like.find(filter)
    .populate<PopulatedChirp>(populateChirp)
    .sort({ _id: -1 })
    .limit(limit);

  const likedChirps = likes.map((like) => like.chirp);
  const oldestId = likes[likes.length - 1]?._id;
  const meta = Object.assign({}, oldestId && { oldestId });

  res.status(200).json({ data: likedChirps, meta });
};

interface PopulatedChirp {
  chirp: IChirp;
}
