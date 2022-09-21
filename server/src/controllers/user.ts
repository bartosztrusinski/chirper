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

  res.status(200).json(createResponse(foundUsers));
};

export const findManyLiking = async (
  req: Request<ChirpId, ResponseBody, unknown, FindManyLiking>,
  res: Response<ResponseBody>
) => {
  const { chirpId } = req.params;
  const { sinceId, userFields, limit } = req.query;

  const { likingUsersIds, oldestId } = await ChirpService.findLikingUsersIds(
    chirpId,
    limit,
    sinceId
  );

  const likingUsers = await UserService.findMany(
    { _id: likingUsersIds },
    userFields
  );

  res.status(200).json(createResponse(likingUsers, { oldestId }));
};

export const findManyFollowing = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyFollowing>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, userFields, limit } = req.query;

  res.status(400);

  const sourceUserId = await UserService.exists(username);

  const { followedUsersIds, oldestId } = await UserService.findFollowedUsersIds(
    sourceUserId,
    limit,
    sinceId
  );

  const followedUsers = await UserService.findMany(
    { _id: followedUsersIds },
    userFields
  );

  res.status(200).json(createResponse(followedUsers, { oldestId }));
};

export const findManyFollowers = async (
  req: Request<UsernameInput, ResponseBody, unknown, FindManyFollowers>,
  res: Response<ResponseBody>
) => {
  const { username } = req.params;
  const { sinceId, userFields, limit } = req.query;

  res.status(400);

  const targetUserId = await UserService.exists(username);

  const { followingUsersIds, oldestId } =
    await UserService.findFollowingUsersIds(targetUserId, limit, sinceId);

  const followingUsers = await UserService.findMany(
    { _id: followingUsersIds },
    userFields
  );

  res.status(200).json(createResponse(followingUsers, { oldestId }));
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
  // const existingUser = await UserService.findOne(login, 'password');

  // const isPasswordMatch = await existingUser.isPasswordMatch(password); // middleware?
  // if (!isPasswordMatch) {
  //   res.status(400);
  //   throw new Error('Sorry, wrong password!');
  // }

  const authToken = generateAuthToken(userId);

  res.status(200).json(createResponse({ _id: userId, authToken }));
};
