import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { SuccessResponse } from '../../interfaces';
import { Chirp, ChirpControllers } from './chirp.interfaces.';
import * as chirpService from './chirp.service';
import * as likeService from '../likes/like.service';
import * as userService from '../users/user.service';
import {
  calculateSkip,
  createSuccessResponse,
  createChirpSortQuery,
} from '../../utils/helper.utils';

const findMany = async (
  req: Request<{}, SuccessResponse, {}, ChirpControllers.FindMany['query']>,
  res: Response<SuccessResponse>
) => {
  const { sinceId, ids, userFields, chirpFields, expandAuthor, limit } =
    req.query;

  res.status(400);

  const filter: FilterQuery<Chirp> = {};
  if (sinceId) filter._id = { $lt: sinceId };
  if (ids) filter._id = ids;

  const foundChirps = await chirpService.findMany(
    filter,
    expandAuthor ? chirpFields + 'author' : chirpFields,
    expandAuthor ? [{ path: 'author', select: userFields }] : [],
    { _id: -1 },
    ids ? ids.length : limit
  );

  const nextPage =
    !ids && foundChirps.length === limit
      ? foundChirps[foundChirps.length - 1]._id
      : undefined;

  res.status(200).json(createSuccessResponse(foundChirps, { nextPage }));
};

const findOne = async (
  req: Request<
    ChirpControllers.FindOne['params'],
    SuccessResponse,
    {},
    ChirpControllers.FindOne['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { chirpId } = req.params;
  const { userFields, chirpFields, expandAuthor } = req.query;

  res.status(400);

  const foundChirp = await chirpService.findOne(
    chirpId,
    expandAuthor ? chirpFields + 'author' : chirpFields,
    expandAuthor ? [{ path: 'author', select: userFields }] : []
  );

  res.status(200).json(createSuccessResponse(foundChirp));
};

const searchMany = async (
  req: Request<{}, SuccessResponse, {}, ChirpControllers.SearchMany['query']>,
  res: Response<SuccessResponse>
) => {
  const {
    query,
    from,
    followedOnly,
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
  const { currentUserId } = req;

  res.status(400);

  const filter: FilterQuery<Chirp> = {
    $text: { $search: query },
  };

  if (!includeReplies) filter.kind = 'post';

  if (followedOnly && currentUserId) {
    const { followedUsersIds } = await userService.findFollowedUsersIds(
      currentUserId
    );
    filter.author = followedUsersIds;
  }

  if (from) {
    try {
      const fromUser = await userService.findOne(from);
      filter.author = fromUser._id;
    } catch {
      filter.author = null;
    }
  }

  const createdAt: { $gte?: Date; $lte?: Date } = {};
  if (startTime) createdAt.$gte = startTime;
  if (endTime) createdAt.$lte = endTime;
  if (createdAt.$gte || createdAt.$lte) filter.createdAt = createdAt;

  const foundChirps = await chirpService.findMany(
    filter,
    expandAuthor ? chirpFields + 'author' : chirpFields,
    expandAuthor ? [{ path: 'author', select: userFields }] : [],
    createChirpSortQuery(sortOrder),
    limit,
    calculateSkip(page, limit)
  );

  const nextPage = foundChirps.length === limit ? page + 1 : undefined;

  res.status(200).json(createSuccessResponse(foundChirps, { nextPage }));
};

const getReplies = async (
  req: Request<
    ChirpControllers.GetReplies['params'],
    SuccessResponse,
    {},
    ChirpControllers.GetReplies['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { chirpId } = req.params;
  const { sinceId, userFields, chirpFields, expandAuthor, limit } = req.query;

  res.status(400);

  const filter: FilterQuery<Chirp> = {
    kind: 'reply',
    parent: chirpId,
  };
  if (sinceId) filter._id = { $lt: sinceId };

  const foundReplies = await chirpService.findMany(
    filter,
    expandAuthor ? chirpFields + 'author' : chirpFields,
    expandAuthor ? [{ path: 'author', select: userFields }] : [],
    { _id: -1 },
    limit
  );

  const nextPage =
    foundReplies.length === limit
      ? foundReplies[foundReplies.length - 1]._id
      : undefined;

  res.status(200).json(createSuccessResponse(foundReplies, { nextPage }));
};

const getUserTimeline = async (
  req: Request<
    ChirpControllers.GetUserTimeline['params'],
    SuccessResponse,
    {},
    ChirpControllers.GetUserTimeline['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { sinceId, expandAuthor, chirpFields, userFields, limit } = req.query;

  res.status(400);

  const timelineUser = await userService.findOne(username);
  const { followedUsersIds } = await userService.findFollowedUsersIds(
    timelineUser._id
  );
  const timelineChirpsAuthorsIds = [...followedUsersIds, timelineUser._id];

  const filter: FilterQuery<Chirp> = {
    author: timelineChirpsAuthorsIds,
  };
  if (sinceId) filter._id = { $lt: sinceId };

  const timelineChirps = await chirpService.findMany(
    filter,
    expandAuthor ? chirpFields + 'author' : chirpFields,
    expandAuthor ? [{ path: 'author', select: userFields }] : [],
    { _id: -1 },
    limit
  );

  const nextPage =
    timelineChirps.length === limit
      ? timelineChirps[timelineChirps.length - 1]._id
      : undefined;

  res.status(200).json(createSuccessResponse(timelineChirps, { nextPage }));
};

const findManyByUser = async (
  req: Request<
    ChirpControllers.FindManyByUser['params'],
    SuccessResponse,
    {},
    ChirpControllers.FindManyByUser['query']
  >,
  res: Response<SuccessResponse>
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

  res.status(400);

  const chirpsAuthor = await userService.findOne(username);

  const filter: FilterQuery<Chirp> = {
    author: chirpsAuthor._id,
  };
  if (sinceId) filter._id = { $lt: sinceId };
  if (!includeReplies) filter.kind = 'post';

  const foundUsersChirps = await chirpService.findMany(
    filter,
    expandAuthor ? chirpFields + 'author' : chirpFields,
    expandAuthor ? [{ path: 'author', select: userFields }] : [],
    { _id: -1 },
    limit
  );

  const nextPage =
    foundUsersChirps.length === limit
      ? foundUsersChirps[foundUsersChirps.length - 1]._id
      : undefined;

  res.status(200).json(createSuccessResponse(foundUsersChirps, { nextPage }));
};

const findManyLiked = async (
  req: Request<
    ChirpControllers.FindManyLiked['params'],
    SuccessResponse,
    {},
    ChirpControllers.FindManyLiked['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { chirpIds, sinceId, userFields, chirpFields, expandAuthor, limit } =
    req.query;

  res.status(400);

  const existingUser = await userService.findOne(username);

  const { likedChirpsIds, nextPage } = await userService.findLikedChirpsIds(
    existingUser._id,
    limit,
    chirpIds ?? sinceId
  );

  const likes = await likeService.findMany(
    { chirp: likedChirpsIds, user: existingUser._id },
    'chirp',
    {
      path: 'chirp',
      select: expandAuthor ? chirpFields + 'author' : chirpFields,
      populate: expandAuthor
        ? { path: 'author', select: userFields }
        : undefined,
    },
    { _id: -1 }
  );

  const likedChirps = likes.map((like) => like.chirp);

  res.status(200).json(createSuccessResponse(likedChirps, { nextPage }));
};

const createOne = async (
  req: Request<{}, SuccessResponse, ChirpControllers.CreateOne['body']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: ChirpControllers.CreateOne['currentUserId'] }
  >req;
  const { content, parentId } = req.body;

  res.status(400);

  const newChirp = await chirpService.createOne(
    content,
    currentUserId,
    parentId
  );

  res.status(200).json(createSuccessResponse(newChirp));
};

const deleteOne = async (
  req: Request<ChirpControllers.DeleteOne['params']>,
  res: Response<SuccessResponse>
) => {
  const { chirpId } = req.params;

  res.status(400);

  await chirpService.deleteOne(chirpId);

  res.status(200).json(createSuccessResponse(null));
};

export {
  findMany,
  findOne,
  searchMany,
  getReplies,
  findManyByUser,
  findManyLiked,
  getUserTimeline,
  createOne,
  deleteOne,
};
