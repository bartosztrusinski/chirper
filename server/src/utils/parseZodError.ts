import { ZodError } from 'zod';

const parseZodError = (error: ZodError) => {
  return {
    message: error.issues.map((issue) => issue.message).join(', '),
    statusCode: 422,
  };
};

export default parseZodError;
