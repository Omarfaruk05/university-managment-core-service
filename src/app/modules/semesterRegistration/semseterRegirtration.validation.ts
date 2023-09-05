import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const createZodSchem = z.object({
  body: z.object({
    startDate: z.string({ required_error: 'Start Date is required.' }),
    endDate: z.string({ required_error: 'End Date is required.' }),
    academicSemesterId: z.string({
      required_error: 'Academec semester id is required.',
    }),
    minCredit: z.number({ required_error: 'Min credit is required.' }),
    maxCredit: z.number({ required_error: 'Max caedit  is required.' }),
  }),
});

const updateZodSchem = z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    academicSemesterId: z.string().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    status: z
      .enum(
        [...Object.values(SemesterRegistrationStatus)] as [string, ...string[]],
        {}
      )
      .optional(),
  }),
});

const enrollOrWithdrawCourseZodSchema = z.object({
  body: z.object({
    offeredCourseId: z.string({
      required_error: 'Offered course id is required.',
    }),
    offeredCourseSectionId: z.string({
      required_error: 'Offered course section id is required.',
    }),
  }),
});

export const SemesterRegistrationValidation = {
  createZodSchem,
  updateZodSchem,
  enrollOrWithdrawCourseZodSchema,
};
