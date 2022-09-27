import jwt from 'jsonwebtoken';
import config from '../config/env.config';
import bcrypt from 'bcryptjs';
import { Types, connection } from 'mongoose';
import { ZodError } from 'zod';
import { SortOrder } from '../api/chirps/chirp.interfaces.';
import { SortQuery, SuccessResponse, AuthPayload } from '../interfaces';

const calculateSkip = (page: number, limit: number) => {
  return (page - 1) * limit;
};

const createChirpSortQuery = (sortOrder: SortOrder) => {
  const sortBy: Record<string, SortQuery> = {
    recent: { createdAt: -1 },
    popular: { 'metrics.likeCount': -1 },
    relevant: { score: { $meta: 'textScore' } },
  };
  const sortQuery: SortQuery = {
    ...sortBy[sortOrder],
    ...sortBy.relevant,
  };
  return sortQuery;
};

const createSuccessResponse = (
  data: SuccessResponse['data'],
  meta?: SuccessResponse['meta']
) => {
  const response: SuccessResponse = { data };

  if (!meta) {
    return response;
  }

  Object.keys(meta).forEach(
    (key) => meta[key] === undefined && delete meta[key]
  );
  if (Object.keys(meta).length) {
    response.meta = meta;
  }

  return response;
};

const generateAuthToken = (userId: Types.ObjectId) => {
  return jwt.sign({ currentUserId: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const generateHash = async (input: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedInput = await bcrypt.hash(input, salt);
  return hashedInput;
};

const listenForDBConnectionErrors = () => {
  connection.on('error', (error) => {
    console.error(error);
    process.exit(1);
  });

  connection.on('disconnected', (error) => {
    console.error(error);
    process.exit(1);
  });
};

const parseAuthHeader = (authHeader: string | undefined) => {
  if (!authHeader) {
    throw new Error('Not authorized, no authorization header provided');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Not authorized, invalid authorization header');
  }

  const authToken = authHeader.split(' ')[1];

  const { currentUserId } = jwt.verify(
    authToken,
    config.jwt.secret
  ) as AuthPayload;

  return new Types.ObjectId(currentUserId);
};

const parseError = (error: Error, statusCode: number) => {
  if (error instanceof ZodError) {
    return parseZodError(error);
  }
  return {
    message: error.message,
    statusCode: statusCode === 200 ? 500 : statusCode,
  };
};

const parseZodError = (error: ZodError) => {
  return {
    message: error.issues.map((issue) => issue.message).join(', '),
    statusCode: 422,
  };
};

export {
  calculateSkip,
  createChirpSortQuery,
  createSuccessResponse,
  generateAuthToken,
  generateHash,
  listenForDBConnectionErrors,
  parseAuthHeader,
  parseError,
};
