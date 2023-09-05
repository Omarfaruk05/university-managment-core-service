export type ISemesterRegistrationFilterRequest = {
  searchTerm?: string;
  academicSemesterId?: string;
};
export type IEnrollCoursePayload = {
  offeredCourseId: string;
  offeredCourseSectionId: string;
};
