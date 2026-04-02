export interface Student {
  name: string;
  id: string;
  avatar: string;
  dept: string;
  level: string;
}

export interface Exam {
  id: number;
  subject: string;
  code: string;
  duration: number;
  questions: number;
  difficulty?: string;
  status?: string;
}

export interface UpcomingExam {
  id: number;
  subject: string;
  date: string;
  time: string;
  duration: number;
  questions: number;
  code: string;
}

export interface ExamResult {
  id: number;
  subject: string;
  code: string;
  date: string;
  score: number;
  total: number;
  grade: string;
  time: string;
  status: string;
}

export interface SubjectPerf {
  subject: string;
  score: number;
  color: string;
}

export interface ProgressEntry {
  month: string;
  score: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

export interface Practice {
  id: number;
  subject: string;
  questions: number;
  attempts: number;
  bestScore: number;
  lastAttempt: string;
}

export type Page =
  | "dashboard"
  | "exams"
  | "exam-interface"
  | "results"
  | "performance"
  | "practice"
  | "notifications"
  | "settings";