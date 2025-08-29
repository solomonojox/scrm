export interface Guardian {
  guardianId: string;
  schoolId: string;
  firstname: string;
  lastname: string;
  relationship: string;
  phone: string;
  occupation: string;
  homeAddress: string;
  workAddress: string;
  stateOfOrigin: string;
  nationality: string;
  religion: string;
  email: string;
  username: string;
  nin: string;
  bvn: string;
  role?: string
  // add any other returned properties you need…
}