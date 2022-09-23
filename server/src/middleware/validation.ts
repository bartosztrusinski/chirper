import { Request, Response, NextFunction } from 'express';
import RequestValidators from '../types/RequestValidators';

export const validateRequest =
  (validators: RequestValidators) =>
  (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
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
  };
