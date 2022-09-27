import { object } from 'zod';
import { objectId, usernameObject } from '../../schemas';

const createOne = object({
  currentUserId: objectId,
  body: usernameObject,
});

const deleteOne = object({
  currentUserId: objectId,
  params: usernameObject,
});

export { createOne, deleteOne };
