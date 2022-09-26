import { Types } from 'mongoose';
import { z } from 'zod';

export const stringToBoolean = z
  .function()
  .args(z.string())
  .returns(z.boolean())
  .implement((str) => str === 'true');

export const optionalStringToNumber = z
  .function()
  .args(z.string().optional())
  .returns(z.number().or(z.nan()))
  .implement((str) => {
    if (!str) return NaN;
    return parseInt(str);
  });

export const setDefaultIfNaN = (defaultValue: number) =>
  z
    .function()
    .args(z.number().or(z.nan()))
    .returns(z.number())
    .implement((value) => {
      if (isNaN(value)) return defaultValue;
      return value;
    });

export const clamp = (min: number, max: number) =>
  z
    .function()
    .args(z.number())
    .returns(z.number())
    .implement((value) => Math.min(Math.max(value, min), max));

export const parseFields = (allowedFields: readonly string[]) =>
  z
    .function()
    .args(z.string())
    .returns(z.string())
    .implement((fields) => {
      return fields
        .split(',')
        .map((field) => field.trim())
        .filter((field) => allowedFields.includes(field))
        .reduce((fields, currentField) => fields + currentField + ' ', '');
    });

export const addDefaultField = (defaultField: string) =>
  z
    .function()
    .args(z.string().optional())
    .returns(z.string())
    .implement((fields) => {
      if (!fields) return defaultField;
      return `${fields},${defaultField}`;
    });

export const stringToId = z
  .function()
  .args(z.string(), z.any())
  .implement((str, ctx: z.RefinementCtx) => {
    try {
      return new Types.ObjectId(str);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Id must be valid',
      });
      return z.NEVER;
    }
  });

export const stringToDate = z
  .function()
  .args(z.string(), z.any())
  .implement((str, ctx: z.RefinementCtx) => {
    const parsedDate = Date.parse(str);
    if (isNaN(parsedDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date must be valid',
      });
      return z.NEVER;
    }
    return new Date(parsedDate);
  });

export const appendAuthorIfExpanded = z
  .function()
  .args(z.any())
  .implement((query) => {
    if (query.expandAuthor) {
      query.chirpFields += 'author';
    }
    return query;
  });

export const createInputSchema = (name: string) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return z
    .string({
      required_error: `${capitalizedName} is required`,
      invalid_type_error: `${capitalizedName} must be a string`,
    })
    .trim();
};
