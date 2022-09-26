import { Model } from 'mongoose';
import { z } from 'zod';
import * as UserSchemas from '../schemas/user';
import { IsPasswordMatch } from '../types/general';

export type Password = z.infer<typeof UserSchemas.password>;
export type Email = z.infer<typeof UserSchemas.email>;
export type Username = z.infer<typeof UserSchemas.username>;
export type Name = z.infer<typeof UserSchemas.name>;
export type Profile = z.infer<typeof UserSchemas.profile>;
export type Metrics = z.infer<typeof UserSchemas.metrics>;
export type MetricsField = keyof Metrics;
export type User = z.infer<typeof UserSchemas.user>;
export interface UserMethods {
  isPasswordMatch: IsPasswordMatch;
}
export type UserModel = Model<User, Record<string, unknown>, UserMethods>;

export type FindMany = z.infer<typeof UserSchemas.findMany>;
export type FindOne = z.infer<typeof UserSchemas.findOne>;
export type SearchMany = z.infer<typeof UserSchemas.searchMany>;
export type FindManyLiking = z.infer<typeof UserSchemas.findManyLiking>;
export type FindManyFollowed = z.infer<typeof UserSchemas.findManyFollowed>;
export type FindManyFollowing = z.infer<typeof UserSchemas.findManyFollowing>;

export type SignUp = z.infer<typeof UserSchemas.signUp>;
export type LogIn = z.infer<typeof UserSchemas.logIn>;
export type UserProfile = z.infer<typeof UserSchemas.updateProfile>;
export type UpdatePassword = z.infer<typeof UserSchemas.updatePassword>;
export type UpdateUsername = z.infer<typeof UserSchemas.updateUsername>;
export type UpdateEmail = z.infer<typeof UserSchemas.updateEmail>;
export type DeleteOne = z.infer<typeof UserSchemas.deleteOne>;
