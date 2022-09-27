import { object } from 'zod';
import { chirpIdObject, objectId } from '../../schemas';

const createOne = object({
  currentUserId: objectId,
  body: chirpIdObject,
});

const deleteOne = object({
  currentUserId: objectId,
  params: chirpIdObject,
});

export { createOne, deleteOne };
