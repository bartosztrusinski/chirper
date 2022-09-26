import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import {
  FindOne,
  FindMany,
  LogIn,
  SearchMany,
  SignUp,
  FindManyLiking,
  FindManyFollowing,
  FindManyFollowed,
  User,
} from '../user.interfaces';
import {
  UsernameObject,
  ChirpIdObject,
  SuccessResponse,
} from '../../../interfaces';
import * as UserService from '../user.service';
import * as ChirpService from '../../chirps/chirp.service';
import {
  calculateSkip,
  createSuccessResponse,
  generateAuthToken,
} from '../../../utils/helper.utils';

export const findMany = async (
  req: Request<unknown, SuccessResponse, unknown, FindMany>,
  res: Response<SuccessResponse>
) => {
  const { ids, userFields } = req.query;

  const foundUsers = await UserService.findMany({ _id: ids }, userFields);

  res.status(200).json(createSuccessResponse(foundUsers));
};

export const findOne = async (
  req: Request<UsernameObject, SuccessResponse, unknown, FindOne>,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { userFields } = req.query;

  res.status(400);

  const foundUser = await UserService.findOne(username, userFields);

  res.status(200).json(createSuccessResponse(foundUser));
};

export const searchMany = async (
  req: Request<unknown, SuccessResponse, unknown, SearchMany>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = req;
  const { query, followedOnly, userFields, limit, page } = req.query;

  const filter: FilterQuery<User> = { $text: { $search: query } };

  if (followedOnly && currentUserId) {
    const { followedUsersIds } = await UserService.findFollowedUsersIds(
      currentUserId
    );
    filter._id = followedUsersIds;
  }

  const foundUsers = await UserService.findMany(
    filter,
    userFields,
    { score: { $meta: 'textScore' } },
    limit,
    calculateSkip(page, limit)
  );

  const nextPage = foundUsers.length ? page + 1 : undefined;

  res.status(200).json(createSuccessResponse(foundUsers, { nextPage }));
};

export const findManyLiking = async (
  req: Request<ChirpIdObject, SuccessResponse, unknown, FindManyLiking>,
  res: Response<SuccessResponse>
) => {
  const { chirpId } = req.params;
  const { sinceId, userFields, limit } = req.query;

  const { likingUsersIds, nextPage } = await ChirpService.findLikingUsersIds(
    chirpId,
    limit,
    sinceId
  );

  const likingUsers = await UserService.findMany(
    { _id: likingUsersIds },
    userFields
  );

  res.status(200).json(createSuccessResponse(likingUsers, { nextPage }));
};

export const findManyFollowed = async (
  req: Request<UsernameObject, SuccessResponse, unknown, FindManyFollowed>,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { sinceId, userFields, limit } = req.query;

  res.status(400);

  const sourceUser = await UserService.findOne(username);

  const { followedUsersIds, nextPage } = await UserService.findFollowedUsersIds(
    sourceUser._id,
    limit,
    sinceId
  );

  const followedUsers = await UserService.findMany(
    { _id: followedUsersIds },
    userFields
  );

  res.status(200).json(createSuccessResponse(followedUsers, { nextPage }));
};

export const findManyFollowing = async (
  req: Request<UsernameObject, SuccessResponse, unknown, FindManyFollowing>,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { sinceId, userFields, limit } = req.query;

  res.status(400);

  const targetUser = await UserService.findOne(username);

  const { followingUsersIds, nextPage } =
    await UserService.findFollowingUsersIds(targetUser._id, limit, sinceId);

  const followingUsers = await UserService.findMany(
    { _id: followingUsersIds },
    userFields
  );

  res.status(200).json(createSuccessResponse(followingUsers, { nextPage }));
};

export const signUp = async (
  req: Request<unknown, SuccessResponse, SignUp>,
  res: Response<SuccessResponse>
) => {
  // verify email
  const { username, email, password, name } = req.body;

  res.status(400);

  await UserService.handleDuplicate(username, email);

  const newUserId = await UserService.createOne(
    username,
    name,
    email,
    password
  );

  const authToken = generateAuthToken(newUserId);

  res.status(201).json(createSuccessResponse({ _id: newUserId, authToken }));
};

export const logIn = async (
  req: Request<unknown, SuccessResponse, LogIn>,
  res: Response<SuccessResponse>
) => {
  const { login, password } = req.body;

  res.status(400);

  const userId = await UserService.confirmPassword(login, password);

  const authToken = generateAuthToken(userId);

  res.status(200).json(createSuccessResponse({ _id: userId, authToken }));
};
