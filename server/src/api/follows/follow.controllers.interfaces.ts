import { TypeOf } from 'zod';
import * as followSchemas from './follow.schemas';

type CreateOne = TypeOf<typeof followSchemas.createOne>;
type DeleteOne = TypeOf<typeof followSchemas.deleteOne>;

export { CreateOne, DeleteOne };
