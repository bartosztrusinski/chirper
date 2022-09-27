import { TypeOf } from 'zod';
import * as likeSchemas from './like.schemas';

type CreateOne = TypeOf<typeof likeSchemas.createOne>;
type DeleteOne = TypeOf<typeof likeSchemas.deleteOne>;

export { CreateOne, DeleteOne };
