import { ZodError } from 'zod';
import parseZodError from './parseZodError';

const parseError = (error: Error, statusCode: number) => {
  if (error instanceof ZodError) {
    return parseZodError(error);
  }
  return {
    message: error.message,
    statusCode: statusCode === 200 ? 500 : statusCode,
  };
};

export default parseError;
