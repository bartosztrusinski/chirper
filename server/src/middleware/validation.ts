import { Handler } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';

export interface RequestValidators {
  body?: z.AnyZodObject;
  params?: z.AnyZodObject;
  query?: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>;
  currentUserId?: z.ZodTypeAny;
}

export const validateRequest =
  (validators: RequestValidators): Handler =>
  (req, res, next) => {
    try {
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json(error);
      }
    }
  };

const transformOptionalFields = (...allowedFields: string[]) =>
  z
    .function()
    .args(z.string().optional())
    .returns(z.string())
    .implement((fields) => {
      fields = fields ? fields + `,${allowedFields[0]}` : allowedFields[0];
      return fields
        .split(',')
        .map((field) => field.trim().toLowerCase())
        .filter((field) => {
          return allowedFields
            .map((field) => field.toLowerCase())
            .includes(field);
        })
        .reduce((str, field) => {
          if (field === 'createdat') {
            field = 'createdAt';
          }
          return str + field + ' ';
        }, '');
    });

export const transformUserFields = transformOptionalFields(
  'username',
  'profile',
  'metrics',
  '_id',
  'createdAt'
);

export const transformChirpFields = transformOptionalFields(
  'content',
  'author',
  'replies',
  'post',
  'parent',
  'metrics',
  '_id',
  'createdat'
);

export const transformExpandAuthor = z
  .function()
  .args(z.string().optional())
  .returns(z.boolean())
  .implement((expandAuthor) => {
    return expandAuthor === 'true';
  });

export const currentUserIdSchema = z.instanceof(Types.ObjectId, {
  message: 'Current user id must be valid',
});

export type CurrentUserId = z.infer<typeof currentUserIdSchema>;

export const usernameSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
  }),
});

export type Username = z.infer<typeof usernameSchema>;

export const chirpIdSchema = z.object({
  chirpId: z.string().transform((id, ctx) => {
    try {
      return new Types.ObjectId(id);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ChirpId must be valid',
      });
      return z.NEVER;
    }
  }),
});

export type ChirpId = z.infer<typeof chirpIdSchema>;
