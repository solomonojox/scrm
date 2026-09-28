export interface ApiResponse<T> {
  status: boolean;
  responseCode: string;
  responseMessage: string;
  data: T;
}

export interface Subject {
  subjectId: string;
  schoolId: string;
  classroomId: string;
  sessionTermId: string;
  subjectName: string;
  description: string;
  teacherId: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface SubjectTeacher {
  subjectTeacherId: string;
  teacherId: string;
  teacherName?: string;
  teacherEmail?: string;
  subjectId: string;
  subjectName: string;
  classroomId: string;
  classroomName: string;
  schoolId: string;
  isPrimary: boolean;
  assignedAt?: string;
  assignedBy?: string;
}

export interface AddSubjectPayload {
  schoolId: string;
  classroomId: string;
  teacherId: string;
  sessionTermId: string;
  subjectName: string;
  description: string;
}

export interface AssignTeacherPayload {
  teacherId: string;
  isPrimary: boolean;
}

export interface TeacherOption {
  teacherId: string;
  name: string;
  phone: string;
  active: boolean; // false for deleted/deactivated teachers
}