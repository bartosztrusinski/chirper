import { Model } from 'mongoose';
import { TypeOf } from 'zod';
import { IsPasswordMatch } from '../../interfaces';
import * as userSchemas from './user.schemas.';
import * as UserControllers from './user.controllers.interfaces';

type User = TypeOf<typeof userSchemas.user>;

interface UserMethods {
  isPasswordMatch: IsPasswordMatch;
}

type UserModel = Model<User, Record<string, unknown>, UserMethods>;

type MetricsField = keyof User['metrics'];

export { User, UserMethods, UserModel, MetricsField, UserControllers };
