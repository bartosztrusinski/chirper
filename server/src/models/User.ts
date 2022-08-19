import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUserProfile {
  name: string;
  picture?: string;
  header?: string;
  bio?: string;
  location?: string;
  website?: string;
}

const userProfileSchema = new Schema<IUserProfile>({
  name: {
    type: String,
    required: [true, 'Profile name is required'],
    max: [50, 'Profile name must be less than 50 characters'],
    match: [/^[^<>]*$/, 'Profile name cannot include invalid characters'],
  },
  picture: {
    type: String,
  },
  header: {
    type: String,
  },
  bio: {
    type: String,
    max: [160, 'Description must be less than 160 characters'],
    match: [/^[^<>]*$/, 'Description cannot include invalid characters'],
  },
  location: {
    type: String,
    max: [30, 'Location must be less than 30 characters'],
    match: [/^[^<>]*$/, 'Location cannot include invalid characters'],
  },
  website: {
    type: String,
    max: [100, 'Website URL must be less than 100 characters'],
    match: [
      /^(https?:\/\/)?(www.)?([a-z0-9]+\.)+[a-zA-Z]{2,}\/?(\/[a-zA-Z0-9#-_]+\/?)*$/,
      'Website URL must be valid and cannot include invalid characters',
    ],
  },
});

export interface IUser {
  username: string;
  email: string;
  password: string;
  profile: IUserProfile;
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
      minLength: [5, 'Username must be at least 5 characters'],
      maxLength: [50, 'Username must be less than 50 characters'],
      match: [
        /^[A-Za-z0-9_]*$/,
        'Username can only contain letters, numbers and "_"',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address',
      ],
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
    },
    profile: userProfileSchema,
    // follows
    // followers
    // chirps
    // replies
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
  candidatePassword
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

userSchema.method('comparePassword', comparePassword);

const User = model<IUser, UserModel>('User', userSchema);

export default User;
