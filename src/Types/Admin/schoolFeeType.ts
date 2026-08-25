export interface schoolFee {
  classFeeId: string;
  schoolId: string;
  classroomId: string;
  sessionId: string;
  termId: string;
  amount: number;
  classroomName: string;
  classroom: null | object;
  school: null | object;
}
