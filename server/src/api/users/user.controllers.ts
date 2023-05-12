import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { SuccessResponse } from '../../interfaces';
import { User, UserControllers } from './user.interfaces';
import * as chirpService from '../chirps/chirp.service';
import * as userService from './user.service';
import {
  calculateSkip,
  createSuccessResponse,
  generateAuthToken,
} from '../../utils/helper.utils';

const findMany = async (
  req: Request<{}, SuccessResponse, {}, UserControllers.FindMany['query']>,
  res: Response<SuccessResponse>
) => {
  const { ids, userFields } = req.query;

  const foundUsers = await userService.findMany({ _id: ids }, userFields);

  res.status(200).json(createSuccessResponse(foundUsers));
};

const findOne = async (
  req: Request<
    UserControllers.FindOne['params'],
    SuccessResponse,
    {},
    UserControllers.FindOne['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { userFields } = req.query;

  res.status(400);

  const foundUser = await userService.findOne(username, userFields);

  res.status(200).json(createSuccessResponse(foundUser));
};

const exists = async (
  req: Request<{}, SuccessResponse, {}, UserControllers.Exists['query']>,
  res: Response<SuccessResponse>
) => {
  const { username, email } = req.query;
  const id = username ?? email;

  res.status(400);

  if (!id) {
    throw new Error('Please provide a username or email');
  }

  const userExists = await userService.exists(id);

  if (!userExists) {
    res.status(404).end();
  }

  res.status(200).end();
};

const searchMany = async (
  req: Request<{}, SuccessResponse, {}, UserControllers.SearchMany['query']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = req;
  const { query, followedOnly, userFields, limit, page } = req.query;

  const filter: FilterQuery<User> = { $text: { $search: query } };

  if (followedOnly && currentUserId) {
    const { followedUsersIds } = await userService.findFollowedUsersIds(
      currentUserId
    );
    filter._id = followedUsersIds;
  }

  const foundUsers = await userService.findMany(
    filter,
    userFields,
    { score: { $meta: 'textScore' } },
    limit,
    calculateSkip(page, limit)
  );

  const nextPage = foundUsers.length === limit ? page + 1 : undefined;

  res.status(200).json(createSuccessResponse(foundUsers, { nextPage }));
};

const findManyLiking = async (
  req: Request<
    UserControllers.FindManyLiking['params'],
    SuccessResponse,
    {},
    UserControllers.FindManyLiking['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { chirpId } = req.params;
  const { sinceId, userFields, limit } = req.query;

  const { likingUsersIds, nextPage } = await chirpService.findLikingUsersIds(
    chirpId,
    limit,
    sinceId
  );

  const likingUsers = await userService.findMany(
    { _id: likingUsersIds },
    userFields
  );

  res.status(200).json(createSuccessResponse(likingUsers, { nextPage }));
};

const findManyFollowed = async (
  req: Request<
    UserControllers.FindManyFollowed['params'],
    SuccessResponse,
    {},
    UserControllers.FindManyFollowed['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { userIds, sinceId, userFields, limit } = req.query;

  res.status(400);

  const sourceUser = await userService.findOne(username);

  const { followedUsersIds, nextPage } = await userService.findFollowedUsersIds(
    sourceUser._id,
    limit,
    userIds ?? sinceId
  );

  const followedUsers = await userService.findMany(
    { _id: followedUsersIds },
    userFields
  );

  res.status(200).json(createSuccessResponse(followedUsers, { nextPage }));
};

const findManyFollowing = async (
  req: Request<
    UserControllers.FindManyFollowing['params'],
    SuccessResponse,
    {},
    UserControllers.FindManyFollowing['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { username } = req.params;
  const { userIds, sinceId, userFields, limit } = req.query;

  res.status(400);

  const targetUser = await userService.findOne(username);

  const { followingUsersIds, nextPage } =
    await userService.findFollowingUsersIds(
      targetUser._id,
      limit,
      userIds ?? sinceId
    );

  const followingUsers = await userService.findMany(
    { _id: followingUsersIds },
    userFields
  );

  res.status(200).json(createSuccessResponse(followingUsers, { nextPage }));
};

const signUp = async (
  req: Request<{}, SuccessResponse, UserControllers.SignUp['body']>,
  res: Response<SuccessResponse>
) => {
  const { username, email, password, name } = req.body;

  res.status(400);

  await userService.handleDuplicate(username, email);

  const newUserId = await userService.createOne(
    username,
    name,
    email,
    password
  );

  const authToken = generateAuthToken(newUserId);

  res.status(201).json(createSuccessResponse({ _id: newUserId, authToken }));
};

const logIn = async (
  req: Request<{}, SuccessResponse, UserControllers.LogIn['body']>,
  res: Response<SuccessResponse>
) => {
  const { login, password } = req.body;

  res.status(400);

  const userId = await userService.validateCredentials(login, password);

  const authToken = generateAuthToken(userId);

  res.status(200).json(createSuccessResponse({ _id: userId, authToken }));
};

const findCurrentOne = async (
  req: Request<
    {},
    SuccessResponse,
    {},
    UserControllers.FindCurrentOne['query']
  >,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: UserControllers.FindCurrentOne['currentUserId'] }
  >req;
  const { userFields } = req.query;

  res.status(400);

  const currentUser = await userService.findOne(currentUserId, userFields);

  res.status(200).json(createSuccessResponse(currentUser));
};

const updateProfile = async (
  req: Request<{}, SuccessResponse, UserControllers.UpdateProfile['body']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: UserControllers.UpdateProfile['currentUserId'] }
  >req;
  const profile = req.body;

  res.status(400);

  const updatedProfile = await userService.updateProfile(
    currentUserId,
    profile
  );

  res.status(200).json(createSuccessResponse(updatedProfile));
};

const updatePassword = async (
  req: Request<{}, SuccessResponse, UserControllers.UpdatePassword['body']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: UserControllers.UpdatePassword['currentUserId'] }
  >req;
  const { newPassword } = req.body;

  res.status(400);

  await userService.updatePassword(currentUserId, newPassword);

  res.status(200).json(createSuccessResponse(null));
};

const updateUsername = async (
  req: Request<{}, SuccessResponse, UserControllers.UpdateUsername['body']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: UserControllers.UpdateUsername['currentUserId'] }
  >req;
  const { newUsername } = req.body;

  res.status(400);

  await userService.updateUsername(currentUserId, newUsername);

  res.status(200).json(createSuccessResponse({ newUsername }));
};

const updateEmail = async (
  req: Request<{}, SuccessResponse, UserControllers.UpdateEmail['body']>,
  res: Response<SuccessResponse>
) => {
  const { currentUserId } = <
    { currentUserId: UserControllers.UpdateEmail['currentUserId'] }
  >req;
  const { newEmail } = req.body;

  res.status(400);

  await userService.updateEmail(currentUserId, newEmail);

  res.status(200).json(createSuccessResponse({ newEmail }));
};

const deleteOne = async (req: Request, res: Response<SuccessResponse>) => {
  const { currentUserId } = <
    { currentUserId: UserControllers.DeleteOne['currentUserId'] }
  >req;

  res.status(400);

  await userService.deleteOne(currentUserId);

  res.status(200).json(createSuccessResponse(null));
};

export {
  findMany,
  findOne,
  exists,
  findCurrentOne,
  searchMany,
  findManyFollowed,
  findManyFollowing,
  findManyLiking,
  signUp,
  logIn,
  updateProfile,
  updatePassword,
  updateUsername,
  updateEmail,
  deleteOne,
};
