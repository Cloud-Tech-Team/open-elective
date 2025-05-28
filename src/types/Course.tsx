export interface Course {
  courseId: string;
  courseName: string;
  seatsAvailable: number;
  description?: string;
  enrolledStudents?: string;
}

export interface CourseStatistics {
  courseCode: string;
  seatsAvailable: number;
  enrolledCount: number;
  totalCapacity: number;
  enrollmentPercentage: string;
}
