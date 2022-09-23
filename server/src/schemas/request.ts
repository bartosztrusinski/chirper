import { Types } from 'mongoose';
import { z } from 'zod';
import config from '../config/request';
import {
  addDefaultField,
  clamp,
  createInputSchema,
  optionalStringToNumber,
  parseFields,
  setDefaultIfNaN,
  stringToBoolean,
  stringToId,
} from './util';

export const query = createInputSchema('query');

export const stringId = createInputSchema('id').transform(stringToId);

export const objectId = z.instanceof(Types.ObjectId, {
  message: 'Id must be valid',
});

export const sinceId = stringId.optional();

export const chirpIdObject = z.object({
  chirpId: stringId,
});

export const usernameInput = z.string();

export const usernameObject = z.object({
  username: usernameInput,
});

export const ids = z
  .array(stringId, {
    invalid_type_error: 'Ids must be an array',
    required_error: 'Ids is required',
  })
  .nonempty({ message: 'You must provide at least one id' })
  .max(config.limit.max, `You can only provide up to ${config.limit.max} ids`);

export const followedOnly = createInputSchema('followedOnly')
  .default('false')
  .transform(stringToBoolean);

export const limit = createInputSchema('limit')
  .optional()
  .transform(optionalStringToNumber)
  .transform(setDefaultIfNaN(config.limit.default))
  .transform(clamp(config.limit.min, config.limit.max));

export const page = createInputSchema('page')
  .optional()
  .transform(optionalStringToNumber)
  .transform(setDefaultIfNaN(config.page.default))
  .transform(clamp(config.page.min, config.page.max));

export const userFields = createInputSchema('userFields')
  .optional()
  .transform(addDefaultField(config.user.fields.default))
  .transform(parseFields(config.user.fields.allowed));
