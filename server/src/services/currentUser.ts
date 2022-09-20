import { Types } from 'mongoose';
import { Email, Password, Profile, Username } from '../schemas';
import * as User2 from '../services/user';

export const updateProfile = async (id: Types.ObjectId, profile: Profile) => {
  const user = await User2.findOne(id);
  user.profile = profile;
  const updatedUser = await user.save();
  return updatedUser.profile;
};

export const updatePassword = async (
  id: Types.ObjectId,
  password: Password
) => {
  const user = await User2.findOne(id);
  user.password = password;
  await user.save();
};

export const updateUsername = async (
  id: Types.ObjectId,
  username: Username
) => {
  const user = await User2.findOne(id);
  user.username = username;
  await user.save();
};

export const updateEmail = async (id: Types.ObjectId, email: Email) => {
  const user = await User2.findOne(id);
  user.email = email;
  await user.save();
};

export const deleteOne = async (id: Types.ObjectId) => {
  const user = await User2.findOne(id);
  await user.remove();
};
