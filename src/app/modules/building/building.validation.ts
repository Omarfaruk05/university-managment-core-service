import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required.' }),
  }),
});

export const buildingValidation = {
  createZodSchema,
};
