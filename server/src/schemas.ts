import { Types } from 'mongoose';
import { object, instanceof as zodInstanceOf, array } from 'zod';
import config from './config/request.config';
import {
  addDefaultField,
  clamp,
  createInputSchema,
  optionalStringToNumber,
  parseFields,
  setDefaultIfNaN,
  stringToBoolean,
  stringToId,
} from './utils/zodHelper.utils';

const query = createInputSchema('query');

const stringId = createInputSchema('id').transform(stringToId);

const objectId = zodInstanceOf(Types.ObjectId, {
  message: 'Id must be valid',
});

const sinceId = stringId.optional();

const chirpIdObject = object({
  chirpId: stringId,
});

const usernameInput = createInputSchema('username');

const passwordInput = createInputSchema('password');

const usernameObject = object({
  username: usernameInput,
});

const ids = array(stringId, {
  invalid_type_error: 'Ids must be an array',
  required_error: 'Ids is required',
})
  .nonempty({ message: 'You must provide at least one id' })
  .max(config.limit.max, `You can only provide up to ${config.limit.max} ids`)
  .optional();

const followedOnly = createInputSchema('followedOnly')
  .default('false')
  .transform(stringToBoolean);

const limit = createInputSchema('limit')
  .optional()
  .transform(optionalStringToNumber)
  .transform(setDefaultIfNaN(config.limit.default))
  .transform(clamp(config.limit.min, config.limit.max));

const page = createInputSchema('page')
  .optional()
  .transform(optionalStringToNumber)
  .transform(setDefaultIfNaN(config.page.default))
  .transform(clamp(config.page.min, config.page.max));

const userFields = createInputSchema('userFields')
  .optional()
  .transform(addDefaultField(config.user.fields.default))
  .transform(parseFields(config.user.fields.allowed));

export {
  query,
  stringId,
  objectId,
  sinceId,
  chirpIdObject,
  usernameInput,
  passwordInput,
  usernameObject,
  ids,
  followedOnly,
  limit,
  page,
  userFields,
};
