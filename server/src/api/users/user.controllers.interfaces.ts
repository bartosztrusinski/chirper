import { TypeOf } from 'zod';
import * as userSchemas from './user.schemas.';

type FindMany = TypeOf<typeof userSchemas.findMany>;
type FindOne = TypeOf<typeof userSchemas.findOne>;
type FindCurrentOne = TypeOf<typeof userSchemas.findCurrentOne>;
type SearchMany = TypeOf<typeof userSchemas.searchMany>;
type FindManyLiking = TypeOf<typeof userSchemas.findManyLiking>;
type FindManyFollowed = TypeOf<typeof userSchemas.findManyFollowed>;
type FindManyFollowing = TypeOf<typeof userSchemas.findManyFollowing>;
type SignUp = TypeOf<typeof userSchemas.signUp>;
type LogIn = TypeOf<typeof userSchemas.logIn>;
type UpdateProfile = TypeOf<typeof userSchemas.updateProfile>;
type UpdatePassword = TypeOf<typeof userSchemas.updatePassword>;
type UpdateUsername = TypeOf<typeof userSchemas.updateUsername>;
type UpdateEmail = TypeOf<typeof userSchemas.updateEmail>;
type DeleteOne = TypeOf<typeof userSchemas.deleteOne>;

export {
  FindMany,
  FindOne,
  FindCurrentOne,
  SearchMany,
  FindManyLiking,
  FindManyFollowed,
  FindManyFollowing,
  SignUp,
  LogIn,
  UpdateProfile,
  UpdatePassword,
  UpdateUsername,
  UpdateEmail,
  DeleteOne,
};
