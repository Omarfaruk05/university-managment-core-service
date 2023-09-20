import { z } from 'zod';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';

const createZodSchema = z.object({
  body: z.object({
    year: z.string({ required_error: 'Year is required.' }),
    title: z.enum([...academicSemesterTitles] as [string, ...string[]], {
      required_error: 'Title is required',
    }),
    code: z.enum([...academicSemesterCodes] as [string, ...string[]], {
      required_error: 'Code is required',
    }),
    startMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'Start Month is required.',
    }),
    endMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'End Month is required.',
    }),
  }),
});

const updateZodSchema = z.object({
  body: z.object({
    title: z
      .enum([...academicSemesterTitles] as [string, ...string[]])
      .optional(),
    code: z
      .enum([...academicSemesterCodes] as [string, ...string[]])
      .optional(),
    year: z.string().optional(),
    startMonth: z
      .enum([...academicSemesterMonths] as [string, ...string[]])
      .optional(),
    endMonth: z
      .enum([...academicSemesterMonths] as [string, ...string[]])
      .optional(),
  }),
});

export const academicSemesterValidation = {
  createZodSchema,
  updateZodSchema,
};
