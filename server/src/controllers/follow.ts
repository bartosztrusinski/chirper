import { Handler } from 'express';
import Follow from '../models/Follow';
import User, { IUser } from '../models/User';
import { BadRequestError } from '../utils/errors';

interface PopulatedTargetUser {
  targetUser: IUser;
}

interface PopulatedSourceUser {
  sourceUser: IUser;
}

export const getUserFollowing: Handler = async (req, res) => {
  const { username } = req.params;
  const user = await User.exists({ username });

  const follows = await Follow.find({
    sourceUser: user?._id,
  }).populate<PopulatedTargetUser>({
    path: 'targetUser',
    select: 'username profile.name',
  });

  // const followingIds = follows.map((follow) => follow.targetUser);
  // const followedUsers = await User.find(
  //   { _id: { $in: followingIds } },
  //   '_id username profile.name'
  // );

  const following = follows.map(({ targetUser }) => targetUser);

  res.status(200).json(following);
};

export const getUserFollowers: Handler = async (req, res) => {
  const { username } = req.params;
  const user = await User.exists({ username });

  const follows = await Follow.find({
    targetUser: user?._id,
  }).populate<PopulatedSourceUser>({
    path: 'sourceUser',
    select: 'username profile.name',
  });

  // const followers = follows.map((follow) => ({
  //   _id: follow.sourceUser._id,
  //   username: follow.sourceUser.username,
  //   name: follow.sourceUser.profile.name,
  // }));
  const followers = follows.map((follow) => follow.sourceUser);

  res.status(200).json(followers);
};

export const followUser: Handler = async (req, res) => {
  const { currentUserId } = req;
  const { targetUsername } = req.body;

  const currentUser = await User.exists({ _id: currentUserId });
  if (!currentUser) {
    throw new BadRequestError('Sorry, we could not find your account');
  }

  const targetUser = await User.exists({ username: targetUsername });
  if (!targetUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to follow'
    );
  }

  const isFollowed = await Follow.exists({
    sourceUser: currentUser._id,
    targetUser: targetUser._id,
  });
  if (isFollowed) {
    throw new BadRequestError('You are already following this user');
  }

  const newFollow = await Follow.create({
    sourceUser: currentUser._id,
    targetUser: targetUser._id,
  });

  res.status(200).json({ following: Boolean(newFollow) });
};

export const unfollowUser: Handler = async (req, res) => {
  const { currentUserId } = req;
  const { targetUsername } = req.params;

  // const currentUser = await User.exists({ _id: currentUserId });
  // if (!currentUser) {
  //   throw new BadRequestError('Sorry, we could not find your account');
  // }

  const targetUser = await User.exists({ username: targetUsername });
  if (!targetUser) {
    throw new BadRequestError(
      'Sorry, we could not find the user you are trying to unfollow'
    );
  }

  // const isFollowed = await Follow.exists({
  //   sourceUser: currentUser._id,
  //   targetUser: targetUser._id,
  // });
  // if (!isFollowed) {
  //   throw new BadRequestError('You are not following this user');
  // }

  const deletedFollow = await Follow.findOneAndDelete({
    sourceUser: currentUserId,
    targetUser: targetUser._id,
  });
  if (!deletedFollow) {
    throw new BadRequestError('You are not following this user');
  }

  res.status(200).json({ following: !deletedFollow });
};

// export const getCurrentUserFollowing: Handler = async (req, res) => {
//   const { currentUserId } = req;

//   const follows = await Follow.find({
//     sourceUser: currentUserId,
//   }).populate<PopulatedTargetUser>({
//     path: 'targetUser',
//     select: 'username profile.name',
//   });

//   const following = follows.map(({ targetUser }) => targetUser);
//   // const followingIds = following.map((follow) => follow.targetUser);
//   // const followedUsers = await User.find(
//   //   { _id: { $in: followingIds } },
//   //   '_id username profile.name'
//   // );

//   res.status(200).json(following);
// };

// export const getCurrentUserFollowers: Handler = async (req, res) => {
//   const { currentUserId } = req;

//   const follows = await Follow.find({
//     targetUser: currentUserId,
//   }).populate<PopulatedSourceUser>({
//     path: 'sourceUser',
//     select: 'username profile.name',
//   });

//   // const followerIds = followers.map((follow) => follow.sourceUser);
//   // const followers = await User.find(
//   //   { _id: { $in: followerIds } },
//   //   '_id username profile.name'
//   // );

//   const followers = follows.map(({ sourceUser }) => sourceUser);

//   res.status(200).json(followers);
// };
