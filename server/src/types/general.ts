import { z } from 'zod';
import { JwtPayload } from 'jsonwebtoken';
import { SortValues } from 'mongoose';
import { chirpIdObject, usernameObject } from '../schemas/request';

type UsernameObject = z.infer<typeof usernameObject>;

type ChirpIdObject = z.infer<typeof chirpIdObject>;

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

interface RequestValidators {
  body?: z.AnyZodObject;
  params?: z.AnyZodObject;
  query?: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>;
  currentUserId?: z.ZodTypeAny;
}

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
