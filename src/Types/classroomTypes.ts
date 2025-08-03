export interface classrooms {
  id: string
  classroomId: string;
  schoolId: string;
  name: string;
  capacity: number;
  teacherId: string;
  teacher: string | null;
  schoolFee: string;
  students?: [];
  subjects?: [];
  assignment?: [];
}
