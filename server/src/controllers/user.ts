import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { IUser } from '../models/User';
import {
  FindOne,
  FindMany,
  LogIn,
  SearchMany,
  SignUp,
  FindManyLiking,
  FindManyFollowers,
  FindManyFollowing,
} from '../schemas/user';
import { UsernameInput, ResponseBody, ChirpId } from '../schemas';
import * as UserService from '../services/user';
import * as ChirpService from '../services/chirp';
import createResponse from '../utils/createResponse';
import calculateSkip from '../utils/calculateSkip';
import generateAuthToken from '../utils/generateAuthToken';

export const findMany = async (
  req: Request<unknown, ResponseBody, unknown, FindMany>,
  res: Response<ResponseBody>
) => {
  const { ids, userFields } = req.query;

  const foundUsers = await UserService.findMany({ _id: ids }, userFields);

  res.status(200).json(createResponse(foundUsers));
};

export const findOne = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindOne>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { userFields } = req.query;

  res.status(400);

  const foundUser = await UserService.findOne(username, userFields);

  res.status(200).json(createResponse(foundUser));
};

export const searchMany = async (
  req: Request<unknown, ResponseBody, unknown, SearchMany>,
  res: Response<ResponseBody>
) => {
  const { currentUserId } = req;
  const { query, followedOnly, userFields, limit, page } = req.query;

  const filter: FilterQuery<IUser> = { $text: { $search: query } };

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

  res.status(200).json(createResponse(foundUsers, { nextPage }));
};

export const findManyLiking = async (
  req: Request<ChirpId, ResponseBody, unknown, FindManyLiking>,
  res: Response<ResponseBody>
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

  res.status(200).json(createResponse(likingUsers, { nextPage }));
};

export const findManyFollowing = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyFollowing>,
  res: Response<ResponseBody>
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

  res.status(200).json(createResponse(followedUsers, { nextPage }));
};

export const findManyFollowers = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyFollowers>,
  res: Response<ResponseBody>
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

  res.status(200).json(createResponse(followingUsers, { nextPage }));
};

export const signUp = async (
  req: Request<unknown, ResponseBody, SignUp>,
  res: Response<ResponseBody>
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

  res.status(201).json(createResponse({ _id: newUserId, authToken }));
};

export const logIn = async (
  req: Request<unknown, ResponseBody, LogIn>,
  res: Response<ResponseBody>
) => {
  const { login, password } = req.body;

  res.status(400);

  const userId = await UserService.confirmPassword(login, password);

  const authToken = generateAuthToken(userId);

  res.status(200).json(createResponse({ _id: userId, authToken }));
};
