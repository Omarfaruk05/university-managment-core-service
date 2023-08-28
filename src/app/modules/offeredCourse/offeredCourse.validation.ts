import { z } from 'zod';

const createZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'Academic Department id is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration id is required',
    }),
    courseIds: z.array(
      z.string({
        required_error: 'Course id is required',
      }),
      {
        required_error: 'Course ids are required',
      }
    ),
  }),
});

export const OfferedCourseValidation = {
  createZodSchema,
};
