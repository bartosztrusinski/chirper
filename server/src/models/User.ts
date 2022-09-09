import { Schema, model, Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import Follow from './Follow';
import Like from './Like';
interface IUserProfile {
  name: string;
  picture?: string;
  header?: string;
  bio?: string;
  location?: string;
  website?: string;
}

interface IUserMetrics {
  followersCount: number;
  followingCount: number;
  chirpCount: number;
  likedChirpCount: number;
}

const userProfileSchema = new Schema<IUserProfile>({
  name: {
    type: String,
    required: [true, 'Profile name is required'],
    max: [50, 'Profile name must be less than 50 characters'],
    match: [/^[^<>]*$/, 'Profile name cannot include invalid characters'],
    trim: true,
  },
  picture: {
    type: String,
    trim: true,
  },
  header: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    max: [160, 'Description must be less than 160 characters'],
    match: [/^[^<>]*$/, 'Description cannot include invalid characters'],
    trim: true,
  },
  location: {
    type: String,
    max: [30, 'Location must be less than 30 characters'],
    match: [/^[^<>]*$/, 'Location cannot include invalid characters'],
    trim: true,
  },
  website: {
    type: String,
    max: [100, 'Website URL must be less than 100 characters'],
    match: [
      /^(https?:\/\/)?(www.)?([a-z0-9]+\.)+[a-zA-Z]{2,}\/?(\/[a-zA-Z0-9#-_]+\/?)*$/,
      'Website URL must be valid',
    ],
    trim: true,
  },
});

export interface IUser {
  username: string;
  email: string;
  password: string;
  profile: IUserProfile;
  metrics: IUserMetrics;
}

export interface IUserMethods {
  isPasswordMatch: IsPasswordMatch;
}
type IsPasswordMatch = (candidatePassword: string) => Promise<boolean>;

type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type HydratedUser = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      minLength: [5, 'Username must be at least 5 characters'],
      maxLength: [50, 'Username must be less than 50 characters'],
      match: [
        /^[A-Za-z0-9_]*$/,
        'Username can only contain letters, numbers and "_"',
      ],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address',
      ],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters'],
      maxLength: [64, 'Password must be less than 64 characters'],
      match: [
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[^\s<>]*$/,
        'Password must contain at least one uppercase, one lowercase, and one number characters',
      ],
      trim: true,
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

const generateHash = async (input: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedInput = bcrypt.hash(input, salt);
  return hashedInput;
};

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const hashedPassword = await generateHash(this.password);
  this.password = hashedPassword;
  next();
});

userSchema.post('remove', async function removeDependencies() {
  const follows = await Follow.find({
    $or: [{ sourceUser: this._id }, { targetUser: this._id }],
  });
  const likes = await Like.find({ user: this._id });
  await Promise.all([...likes, ...follows].map((doc) => doc.remove()));
});

const isPasswordMatch: IsPasswordMatch = function (
  this: IUser,
  candidatePassword
) {
  const isMatch = bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

userSchema.method('isPasswordMatch', isPasswordMatch);

userSchema.index({ username: 'text', 'profile.name': 'text' });

const User = model<IUser, UserModel>('User', userSchema);

export default User;
