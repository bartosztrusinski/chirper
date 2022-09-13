import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export interface RequestValidators {
  body?: z.AnyZodObject;
  params?: z.AnyZodObject;
  query?: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>;
  currentUserId?: z.ZodTypeAny;
}

export const validateRequest =
  (validators: RequestValidators) =>
  (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (validators.body) {
        req.body = validators.body.parse(req.body);
      }
      if (validators.params) {
        req.params = validators.params.parse(req.params);
      }
      if (validators.query) {
        req.query = validators.query.parse(req.query);
      }
      if (validators.currentUserId) {
        req.currentUserId = validators.currentUserId.parse(req.currentUserId);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json(error);
      }
    }
  };
