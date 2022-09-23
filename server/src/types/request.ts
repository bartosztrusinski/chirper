import { z } from 'zod';
import { chirpIdObject, usernameObject } from '../schemas/request';

export type UsernameObject = z.infer<typeof usernameObject>;
export type ChirpIdObject = z.infer<typeof chirpIdObject>;
