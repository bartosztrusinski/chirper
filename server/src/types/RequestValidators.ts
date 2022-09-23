import { z } from 'zod';

interface RequestValidators {
  body?: z.AnyZodObject;
  params?: z.AnyZodObject;
  query?: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>;
  currentUserId?: z.ZodTypeAny;
}

export default RequestValidators;
