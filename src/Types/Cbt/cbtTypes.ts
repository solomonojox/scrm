export interface CbtSubjectType {
  subjectId: string;
  subjectName: string;
  description: string;
  teacherId: string;
}

export interface AllExamQuestionType {
  id: string;
  examType: string;
  title: string;
  schoolId?: string;
  classLevel: string | null;
  term: string;
  subjectId: string;
  subjectName: string;
  examDate: string | null;
  durationMinutes: number;
  academicSession: string;
  status: string;
  totalQuestions: number;
  totalStudents: number;
  averageScore: number;
  progress: number;
}

export interface ExamQuestion {
  id: string;
  questionText: string;
  quizType: string;
  quizSubjectId: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface ExamFilterParams {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
  status?: string;
  subjectName?: string;
  examType?: string;
  term?: string;
}

export interface PaginatedExamResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  result: AllExamQuestionType[];
}