import { Handler } from 'express';
import {
  IPost,
  PopulatedAuthor,
  PopulatedReplies,
  PostChirp,
} from '../../models/Chirp';
import User from '../../models/User';
import { BadRequestError } from '../../utils/errors';

export const getUserPosts: Handler = async (req, res) => {
  const { username } = req.params;

  const postsAuthor = await User.findOne({ username });
  if (!postsAuthor) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  const foundUsersPosts = await PostChirp.find({ author: postsAuthor._id });
  res.status(200).json(foundUsersPosts);
};

export const createPost: Handler = async (req, res) => {
  const { content } = req.body;
  const { currentUserId } = req;

  if (!currentUserId) {
    throw new BadRequestError('Sorry, you must be logged in to post');
  }

  const newPost = await PostChirp.create<IPost>({
    content,
    author: currentUserId,
    replies: [],
  });

  res.status(200).json(newPost);
};

// user deletes post
export const deletePost: Handler = async (req, res) => {
  const { chirpId } = req.params;

  const foundPost = await PostChirp.findById(chirpId);
  if (!foundPost) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  const deletedPost = await foundPost.remove();
  res.status(200).json(deletedPost._id);
};

export const getPost: Handler = async (req, res) => {
  const { chirpId } = req.params;

  const foundPost = await PostChirp.findById(chirpId)
    .populate<PopulatedReplies>({
      path: 'replies',
      select: 'content author',
      populate: {
        path: 'author',
        select: 'profile',
      },
    })
    .populate<PopulatedAuthor>({
      path: 'author',
      select: 'profile',
    });

  if (!foundPost) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  res.status(200).json(foundPost);
};
