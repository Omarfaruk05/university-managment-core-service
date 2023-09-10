import { Course, StudentEnrolledCourse } from '@prisma/client';

const getGradeFromMarks = (marks: number) => {
  const result = {
    grade: '',
    point: 0,
  };
  if (marks >= 0 && marks <= 39) {
    result.grade = 'F';
    result.point = 0;
  } else if (marks >= 40 && marks <= 50) {
    result.grade = 'D';
    result.point = 2.0;
  } else if (marks >= 50 && marks <= 59) {
    result.grade = 'C';
    result.point = 2.5;
  } else if (marks >= 60 && marks <= 69) {
    result.grade = 'B';
    result.point = 4.0;
  } else if (marks >= 70 && marks <= 79) {
    result.grade = 'A';
    result.point = 3.5;
  } else if (marks >= 80 && marks <= 109) {
    result.grade = 'A+';
    result.point = 4.0;
  }

  return result;
};

const calcCGPAandGrade = (
  payload: (StudentEnrolledCourse & { course: Course })[]
) => {
  if (payload.length === 0) {
    return {
      totalCompletedCredit: 0,
      cgpa: 0,
    };
  }

  let totalCredit = 0;
  let totalCGPA = 0;
  for (const grade of payload) {
    totalCGPA += grade.point || 0;
    totalCredit += grade.course.credits || 0;
  }

  const avgCGPA = Number((totalCGPA / payload.length).toFixed(2));

  return {
    totalCompletedCredite: totalCredit,
    cgpa: avgCGPA,
  };
};

export const StudentEnrolledCourseMarkUtils = {
  getGradeFromMarks,
  calcCGPAandGrade,
};
