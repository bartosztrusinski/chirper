import { Handler } from 'express';
import { Chirp } from '../../models/Chirp';
import User from '../../models/User';
import { BadRequestError } from '../../utils/errors';

export const getUserChirps: Handler = async (req, res) => {
  const { username } = req.params;

  const chirpsAuthor = await User.findOne({ username });
  if (!chirpsAuthor) {
    throw new BadRequestError('Sorry, we could not find that user');
  }

  const foundUsersChirps = await Chirp.find({ author: chirpsAuthor._id });
  res.status(200).json(foundUsersChirps);
};
