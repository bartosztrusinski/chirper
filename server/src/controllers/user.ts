import { Request, Response } from 'express';
import { BadRequestError } from '../utils/errors';

export const getUsers = (req: Request, res: Response) => {
  res.json({ message: 'All users are here' });
};

export const createUser = (req: Request, res: Response) => {
  if (!req.body.name) {
    throw new BadRequestError('Name is required');
  }
  res.status(201).json({ message: 'New user created' });
};

export const getUser = (req: Request, res: Response) => {
  res.json({ message: `User ${req.params.id} found` });
};

export const updateUser = (req: Request, res: Response) => {
  res.json({ message: `User ${req.params.id} updated` });
};

export const deleteUser = (req: Request, res: Response) => {
  res.json({ message: `User ${req.params.id} deleted` });
};
