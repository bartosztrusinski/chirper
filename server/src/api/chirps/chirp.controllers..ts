import { Request, Response } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { Chirp } from './chirp.interfaces.';
import { ChirpIdObject, UsernameObject } from '../../interfaces/general';
import {
  CreateOne,
  FindOne,
  FindMany,
  GetUserTimeline,
  SearchMany,
  FindManyByUser,
  FindManyLiked,
} from './chirp.interfaces.';
import * as ChirpService from './chirp.service';
import * as UserService from '../users/user.service';
import calculateSkip from '../../utils/calculateSkip';
import createChirpSort from '../../utils/createChirpSort';
import createSuccessResponse from '../../utils/createSuccessResponse';
import createChirpPopulate from '../../utils/createChirpPopulate';
import { SuccessResponse } from '../../interfaces/general';

export const findMany = async (
  req: Request<unknown, SuccessResponse, unknown, FindMany>,
  res: Response<SuccessResponse>
) => {
  const { ids, userFields, chirpFields, expandAuthor } = req.query;

  const foundChirps = await ChirpService.findMany(
    { _id: ids },
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : []
  );

  res.status(200).json(createSuccessResponse(foundChirps));
};

export const findOne = async (
  req: Request<ChirpIdObject, SuccessResponse, unknown, FindOne>,
  res: Response<SuccessResponse>
) => {
  const { chirpId } = req.params;
  const { userFields, chirpFields, expandAuthor } = req.query;

  res.status(400);

  const foundChirp = await ChirpService.findOne(
    chirpId,
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : []
    // expandReplies ? createChirpPopulate(chirpFields) : [] ??????????
  );

  res.status(200).json(createSuccessResponse(foundChirp));
};

export const searchMany = async (
  req: Request<unknown, SuccessResponse, unknown, SearchMany>,
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
    const { followedUsersIds } = await UserService.findFollowedUsersIds(
      currentUserId
    );
    filter.author = followedUsersIds;
  }

  if (from) {
    const fromUser = await UserService.findOne(from);
    filter.author = fromUser._id;
  }

  const createdAt: { $gte?: Date; $lte?: Date } = {};
  if (startTime) createdAt.$gte = startTime;
  if (endTime) createdAt.$lte = endTime;
  if (createdAt.$gte || createdAt.$lte) filter.createdAt = createdAt;

  const foundChirps = await ChirpService.findMany(
    filter,
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : [],
    createChirpSort(sortOrder),
    limit,
    calculateSkip(page, limit)
  );

  const nextPage = foundChirps.length ? page + 1 : undefined;

  res.status(200).json(createSuccessResponse(foundChirps, { nextPage }));
};

export const getUserTimeline = async (
  req: Request<UsernameObject, SuccessResponse, unknown, GetUserTimeline>,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { sinceId, expandAuthor, chirpFields, userFields, limit } = req.query;

  res.status(400);

  const timelineUser = await UserService.findOne(username);
  const { followedUsersIds } = await UserService.findFollowedUsersIds(
    timelineUser._id
  );
  const timelineChirpsAuthorsIds = [...followedUsersIds, timelineUser._id];

  const filter: FilterQuery<Chirp> = { author: timelineChirpsAuthorsIds };
  if (sinceId) filter._id = { $lt: sinceId };

  const timelineChirps = await ChirpService.findMany(
    filter,
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : [],
    { _id: -1 },
    limit
  );

  const nextPage = timelineChirps[timelineChirps.length - 1]?._id;

  res.status(200).json(createSuccessResponse(timelineChirps, { nextPage }));
};

export const findManyByUser = async (
  req: Request<UsernameObject, SuccessResponse, unknown, FindManyByUser>,
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

  const chirpsAuthor = await UserService.findOne(username);

  const filter: FilterQuery<Chirp> = { author: chirpsAuthor._id };
  if (sinceId) filter._id = { $lt: sinceId };
  if (!includeReplies) filter.kind = 'post';

  const foundUsersChirps = await ChirpService.findMany(
    filter,
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : [],
    { _id: -1 },
    limit
  );

  const nextPage = foundUsersChirps[foundUsersChirps.length - 1]?._id;

  res.status(200).json(createSuccessResponse(foundUsersChirps, { nextPage }));
};

export const findManyLiked = async (
  req: Request<UsernameObject, SuccessResponse, unknown, FindManyLiked>,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { sinceId, userFields, chirpFields, expandAuthor, limit } = req.query;

  res.status(400);

  const existingUser = await UserService.findOne(username);

  const { likedChirpsIds, nextPage } = await UserService.findLikedChirpsIds(
    existingUser._id,
    limit,
    sinceId
  );

  const likedChirps = await ChirpService.findMany(
    { _id: likedChirpsIds },
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : []
  );

  res.status(200).json(createSuccessResponse(likedChirps, { nextPage }));
};

export const createOne = async (
  req: Request<unknown, SuccessResponse, CreateOne>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { content, parentId } = req.body;

  res.status(400);

  const newChirp = await ChirpService.createOne(
    content,
    currentUserId,
    parentId
  );

  res.status(200).json(createSuccessResponse(newChirp));
};

export const deleteOne = async (
  req: Request<ChirpIdObject>,
  res: Response<SuccessResponse>
) => {
  const { chirpId } = req.params;

  res.status(400);

  await ChirpService.deleteOne(chirpId);

  res.status(200).json(createSuccessResponse(null));
};
