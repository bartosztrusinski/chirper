import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { SuccessResponse } from '../../interfaces';
import { Chirp, ChirpControllers } from './chirp.interfaces.';
import * as chirpService from './chirp.service';
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
  const { ids, userFields, chirpFields, expandAuthor } = req.query;

  const foundChirps = await chirpService.findMany(
    { _id: ids },
    expandAuthor ? chirpFields + 'author' : chirpFields,
    expandAuthor ? [{ path: 'author', select: userFields }] : []
  );

  res.status(200).json(createSuccessResponse(foundChirps));
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
    const fromUser = await userService.findOne(from);
    filter.author = fromUser._id;
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

  const nextPage = foundChirps.length ? page + 1 : undefined;

  res.status(200).json(createSuccessResponse(foundChirps, { nextPage }));
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

  const nextPage = timelineChirps[timelineChirps.length - 1]?._id;

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

  const nextPage = foundUsersChirps[foundUsersChirps.length - 1]?._id;

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
  const { sinceId, userFields, chirpFields, expandAuthor, limit } = req.query;

  res.status(400);

  const existingUser = await userService.findOne(username);

  const { likedChirpsIds, nextPage } = await userService.findLikedChirpsIds(
    existingUser._id,
    limit,
    sinceId
  );

  const likedChirps = await chirpService.findMany(
    { _id: likedChirpsIds },
    expandAuthor ? chirpFields + 'author' : chirpFields,
    expandAuthor ? [{ path: 'author', select: userFields }] : []
  );

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
  findManyByUser,
  findManyLiked,
  getUserTimeline,
  createOne,
  deleteOne,
};
