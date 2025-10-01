export interface classrooms {
  id: string;
  classroomId: string;
  schoolId: string;
  studentNo?: string;
  name: string;
  capacity: number;
  teacherId: string;
  teacher: string | null;
  schoolFee: string;
  firstname?: string;
  gender?: string;
  lastname?: string;
  students?: [];
  subjects?: [];
  assignment?: [];
  currentSession?: string
}
