export interface schoolFee {
  id: string;
  schoolId: string;
  classroomId: string;
  sessionId: string;
  amount: number;
  classroomName: string;
  classroom: null | object;
  school: null | object;
}
