import { Types } from 'mongoose';
import {
  string,
  boolean,
  number,
  nan,
  z,
  function as zodFunction,
  ZodIssueCode,
  RefinementCtx,
  NEVER,
  any,
} from 'zod';

const stringToBoolean = zodFunction()
  .args(string())
  .returns(boolean())
  .implement((str) => str === 'true');

const optionalStringToNumber = zodFunction()
  .args(string().optional())
  .returns(number().or(nan()))
  .implement((str) => {
    if (!str) return NaN;
    return parseInt(str);
  });

const setDefaultIfNaN = (defaultValue: number) =>
  zodFunction()
    .args(number().or(nan()))
    .returns(number())
    .implement((value) => {
      if (isNaN(value)) return defaultValue;
      return value;
    });

const clamp = (min: number, max: number) =>
  zodFunction()
    .args(number())
    .returns(number())
    .implement((value) => Math.min(Math.max(value, min), max));

const parseFields = (allowedFields: readonly string[]) =>
  zodFunction()
    .args(string())
    .returns(string())
    .implement((fields) => {
      return fields
        .split(',')
        .map((field) => field.trim())
        .filter((field) => allowedFields.includes(field))
        .reduce((fields, currentField) => fields + currentField + ' ', '');
    });

const addDefaultField = (defaultField: string) =>
  zodFunction()
    .args(string().optional())
    .returns(string())
    .implement((fields) => {
      if (!fields) return defaultField;
      return `${fields},${defaultField}`;
    });

const stringToId = zodFunction()
  .args(string(), any())
  .implement((str, ctx: RefinementCtx) => {
    try {
      return new Types.ObjectId(str);
    } catch (error) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Id must be valid',
      });
      return NEVER;
    }
  });

const stringToDate = zodFunction()
  .args(string(), any())
  .implement((str, ctx: RefinementCtx) => {
    const parsedDate = Date.parse(str);
    if (isNaN(parsedDate)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Date must be valid',
      });
      return NEVER;
    }
    return new Date(parsedDate);
  });

const createInputSchema = (name: string) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return z
    .string({
      required_error: `${capitalizedName} is required`,
      invalid_type_error: `${capitalizedName} must be a string`,
    })
    .trim();
};

export {
  stringToBoolean,
  optionalStringToNumber,
  setDefaultIfNaN,
  clamp,
  parseFields,
  addDefaultField,
  stringToId,
  stringToDate,
  createInputSchema,
};
