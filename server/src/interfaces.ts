import { SortValues, Types } from 'mongoose';
import { AnyZodObject, TypeOf, ZodObject, ZodTypeAny } from 'zod';
import { JwtPayload } from 'jsonwebtoken';
import { chirpIdObject, usernameObject } from './schemas';

declare module 'express-serve-static-core' {
  export interface Request {
    currentUserId?: Types.ObjectId;
  }
}

type UsernameObject = TypeOf<typeof usernameObject>;

type ChirpIdObject = TypeOf<typeof chirpIdObject>;

interface SortQuery {
  [key: string]: SortValues | { $meta: 'textScore' };
}

interface AuthPayload extends JwtPayload {
  currentUserId: string;
}

type IsPasswordMatch = (candidatePassword: string) => Promise<boolean>;

interface ErrorResponse {
  message: string;
  stack?: string;
}

interface SuccessResponse {
  data: object | null;
  meta?: Record<string, unknown>;
}

type RequestValidators = ZodObject<{
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
  currentUserId?: ZodTypeAny;
}>;

export {
  AuthPayload,
  ErrorResponse,
  RequestValidators,
  SortQuery,
  SuccessResponse,
  UsernameObject,
  ChirpIdObject,
  IsPasswordMatch,
};
