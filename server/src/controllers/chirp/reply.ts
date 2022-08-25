import { Handler } from 'express';
import {
  Chirp,
  IReply,
  PopulatedAuthor,
  PopulatedReplies,
  ReplyChirp,
} from '../../models/Chirp';
import User from '../../models/User';
import { BadRequestError } from '../../utils/errors';

export const getUserReplies: Handler = async (req, res) => {
  const { username } = req.params;

  const repliesAuthor = await User.findOne({ username });
  if (!repliesAuthor) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  const foundUsersReplies = await ReplyChirp.find({
    author: repliesAuthor._id,
  });
  res.status(200).json(foundUsersReplies);
};

export const createReply: Handler = async (req, res) => {
  const { currentUserId } = req;
  const { content } = req.body;
  const { chirpId } = req.params;

  if (!currentUserId) {
    throw new BadRequestError('Sorry, you must be logged in to reply');
  }

  const foundChirp = await Chirp.findById(chirpId);
  if (!foundChirp) {
    throw new BadRequestError(
      'Sorry, we could not find chirp you are replying to'
    );
  }

  const post =
    foundChirp instanceof ReplyChirp ? foundChirp.post : foundChirp._id;

  const newReply = await ReplyChirp.create<IReply>({
    content,
    author: currentUserId,
    post,
    replies: [],
  });

  foundChirp.replies.push(newReply._id);
  await foundChirp.save();

  res.status(200).json(newReply);
};

export const deleteReply: Handler = async (req, res) => {
  const { chirpId } = req.params;

  const foundReply = await ReplyChirp.findById(chirpId);
  if (!foundReply) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  const deletedReply = await foundReply.remove();

  res.status(200).json(deletedReply._id);
};

export const getReply: Handler = async (req, res) => {
  const { chirpId } = req.params;

  const foundReply = await ReplyChirp.findById(chirpId)
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

  if (!foundReply) {
    throw new BadRequestError('Sorry, we could not find that chirp');
  }

  res.status(200).json(foundReply);
};
