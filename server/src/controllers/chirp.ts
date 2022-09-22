import { Request, Response } from 'express';
import { FilterQuery, Types } from 'mongoose';
import { IChirp } from '../models/Chirp';
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
import * as ChirpService from '../services/chirp';
import * as UserService from '../services/user';
import calculateSkip from '../utils/calculateSkip';
import createChirpSort from '../utils/createChirpSort';
import createResponse from '../utils/createResponse';
import createChirpPopulate from '../utils/createChirpPopulate';

export const findMany = async (
  req: Request<unknown, ResponseBody, unknown, FindMany>,
  res: Response<ResponseBody>
) => {
  const { ids, userFields, chirpFields, expandAuthor } = req.query;

  const foundChirps = await ChirpService.findMany(
    { _id: ids },
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : []
  );

  res.status(200).json(createResponse(foundChirps));
};

export const findOne = async (
  req: Request<ChirpId, ResponseBody, unknown, FindOne>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;
  const { userFields, chirpFields, expandAuthor } = req.query;

  res.status(400);

  const foundChirp = await ChirpService.findOne(
    chirpId,
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : []
  );

  res.status(200).json(createResponse(foundChirp));
};

export const searchMany = async (
  req: Request<unknown, ResponseBody, unknown, SearchMany>,
  res: Response<ResponseBody>
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

  const filter: FilterQuery<IChirp> = {
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

  res.status(200).json(createResponse(foundChirps, { nextPage }));
};

export const getUserTimeline = async (
  req: Request<UsernameInput, ResponseBody, unknown, GetUserTimeline>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, expandAuthor, chirpFields, userFields, limit } = req.query;

  res.status(400);

  const timelineUser = await UserService.findOne(username);
  const { followedUsersIds } = await UserService.findFollowedUsersIds(
    timelineUser._id
  );
  const timelineChirpsAuthorsIds = [...followedUsersIds, timelineUser._id];

  const filter: FilterQuery<IChirp> = { author: timelineChirpsAuthorsIds };
  if (sinceId) filter._id = { $lt: sinceId };

  const timelineChirps = await ChirpService.findMany(
    filter,
    chirpFields,
    expandAuthor ? createChirpPopulate(userFields) : [],
    { _id: -1 },
    limit
  );

  const nextPage = timelineChirps[timelineChirps.length - 1]?._id;

  res.status(200).json(createResponse(timelineChirps, { nextPage }));
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

  res.status(400);

  const chirpsAuthor = await UserService.findOne(username);

  const filter: FilterQuery<IChirp> = { author: chirpsAuthor._id };
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

  res.status(200).json(createResponse(foundUsersChirps, { nextPage }));
};

export const findManyLiked = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyLiked>,
  res: Response<ResponseBody>
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

  res.status(200).json(createResponse(likedChirps, { nextPage }));
};

export const createOne = async (
  req: Request<unknown, ResponseBody, CreateOne>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = <{ currentUserId: Types.ObjectId }>req;
  const { content, parentId } = req.body;

  res.status(400);

  const newChirp = await ChirpService.createOne(
    content,
    currentUserId,
    parentId
  );

  res.status(200).json(createResponse(newChirp));
};

export const deleteOne = async (
  req: Request<ChirpId>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;

  res.status(400);

  await ChirpService.deleteOne(chirpId);

  res.status(200).json(createResponse(null));
};
