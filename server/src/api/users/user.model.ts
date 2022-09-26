import { Schema, model } from 'mongoose';
import * as FollowService from '../follows/follow.service';
import * as LikeService from '../likes/like.service';
import { Profile, User, UserMethods, UserModel } from './user.interfaces';
import bcrypt from 'bcryptjs';
import generateHash from '../../utils/generateHash';
import { IsPasswordMatch } from '../../interfaces/general';

const userProfileSchema = new Schema<Profile>(
  {
    name: {
      type: String,
      required: [true, 'Profile name is required'],

      picture: {
        type: String,
      },
      header: {
        type: String,
      },
      bio: {
        type: String,
      },
      location: {
        type: String,
      },
      website: {
        type: String,
      },
    },
  },
  { _id: false }
);

const userSchema = new Schema<User, UserModel, UserMethods>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    profile: {
      type: userProfileSchema,
      required: [true, 'User profile is required'],
    },
    metrics: {
      followersCount: {
        type: Number,
        default: 0,
      },
      followingCount: {
        type: Number,
        default: 0,
      },
      chirpCount: {
        type: Number,
        default: 0,
      },
      likedChirpCount: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ username: 'text', 'profile.name': 'text' });

userSchema.method('isPasswordMatch', function (this: User, candidatePassword) {
  const isMatch = bcrypt.compare(candidatePassword, this.password);
  return isMatch;
} as IsPasswordMatch);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const hashedPassword = await generateHash(this.password);
  this.password = hashedPassword;
  next();
});

userSchema.post('remove', async function removeDependencies() {
  await FollowService.deleteMany({
    $or: [{ sourceUser: this._id }, { targetUser: this._id }],
  });
  await LikeService.deleteMany({ user: this._id });
});

const User = model<User, UserModel>('User', userSchema);

export default User;
