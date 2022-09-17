import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  throw new Error(`🔍️ - Sorry! Not Found ${req.originalUrl}`);
};

export default notFound;
