import { z } from 'zod';

const assignOrRemoveFacultiesZodSchema = z.object({
  body: z.object({
    faculties: z.array(z.string(), {
      required_error: 'Faculties are required.',
    }),
  }),
});

export const CourseValidation = {
  assignOrRemoveFacultiesZodSchema,
};
