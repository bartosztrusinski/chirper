import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  password: string;

  profile: IUserProfile;
}

interface IUserProfile {
  name: string;
  picture?: string;
  backgroundPicture?: string;
  bio?: string;
  location?: string;
  website?: string;
}

interface IUserMethods {
  comparePassword: ComparePasswordFunction;
}

type ComparePasswordFunction = (candidatePassword: string) => Promise<boolean>;

type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      max: [50, 'Username must be less than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      min: [8, 'Password must be at least 8 characters'],
      max: [50, 'Password must be less than 50 characters'],
    },
    profile: {
      name: {
        type: String,
        required: [true, 'Name is required'],
        max: [50, 'Profile name must be less than 50 characters'],
      },
      picture: {
        type: String,
      },
      backgroundPicture: {
        type: String,
      },
      bio: {
        type: String,
        max: [160, 'Biography must be less than 160 characters'],
      },
      location: {
        type: String,
        max: [30, 'Location must be less than 30 characters'],
      },
      website: {
        type: String,
        max: [100, 'Website URL must be less than 100 characters'],
      },
    },
  },
  { timestamps: true }
);

const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hash = await encryptPassword(this.password);
  this.password = hash;
  next();
});

const comparePassword: ComparePasswordFunction = async function (
  this: IUser,
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

userSchema.method('comparePassword', comparePassword);

const User = model<IUser, UserModel>('User', userSchema);

export default User;
