// ─── Initial Data ────────────────────────────────────────────────────────────
export const initStudents = [
  { id: "1", firstname: "Adaeze", lastname: "Okonkwo", gender: "Female", dateOfBirth: "2010-03-15", homeAddress: "12 Marina St, Lagos", admissionSession: "2023/2024", currentTerm: "FIRST", teacherId: "T1", schoolId: "S1" },
  { id: "2", firstname: "Emeka", lastname: "Chukwu", gender: "Male", dateOfBirth: "2009-07-22", homeAddress: "45 Broad St, Lagos", admissionSession: "2022/2023", currentTerm: "SECOND", teacherId: "T2", schoolId: "S1" },
  { id: "3", firstname: "Fatima", lastname: "Bello", gender: "Female", dateOfBirth: "2011-01-10", homeAddress: "8 Adeola Rd, Abuja", admissionSession: "2023/2024", currentTerm: "THIRD", teacherId: "T1", schoolId: "S1" },
];

export const initTeachers = [
  { id: "T1", firstname: "Ngozi", lastname: "Adeyemi", phone: "08012345678", homeAddress: "22 Victoria Island", nationality: "Nigerian", stateOfOrigin: "Anambra", religion: "Christianity", email: "ngozi@school.edu.ng", username: "ngozi.adeyemi", dateOfBirth: "1985-05-20", employmentDate: "2015-09-01", schoolId: "S1" },
  { id: "T2", firstname: "Babatunde", lastname: "Ojo", phone: "08087654321", homeAddress: "5 Ikoyi Crescent", nationality: "Nigerian", stateOfOrigin: "Oyo", religion: "Islam", email: "babatunde@school.edu.ng", username: "babatunde.ojo", dateOfBirth: "1980-11-14", employmentDate: "2010-01-15", schoolId: "S1" },
];

export const initExaminers = [
  { id: "E1", schoolId: "S1", fullname: "Dr. Chidi Obi", email: "chidi.obi@waec.ng" },
  { id: "E2", schoolId: "S1", fullname: "Prof. Amina Hassan", email: "amina.hassan@neco.ng" },
];

export const initExams = [
  { id: "X1", title: "Mathematics Mid-Term", class: "JSS3", classLabel: "Junior Secondary 3", subject: "Mathematics", subjectId: "SUB1", duration: "2 hours", scheduledDate: "2026-06-15", passingScore: 50, instructions: "Attempt all questions. No calculators.", examType: "WAEC", term: "FIRST", academicSession: "2025/2026", schoolId: "S1" },
  { id: "X2", title: "English Language Finals", class: "SS2", classLabel: "Senior Secondary 2", subject: "English Language", subjectId: "SUB2", duration: "3 hours", scheduledDate: "2026-06-20", passingScore: 45, instructions: "Write legibly. Section A is compulsory.", examType: "NECO", term: "SECOND", academicSession: "2025/2026", schoolId: "S1" },
];

export const blankStudent = { firstname: "", lastname: "", gender: "", dateOfBirth: "", homeAddress: "", admissionSession: "", currentTerm: "FIRST", password: "", teacherId: "", schoolId: "S1" };
export const blankTeacher = { firstname: "", lastname: "", phone: "", homeAddress: "", nationality: "Nigerian", stateOfOrigin: "", religion: "", email: "", username: "", dateOfBirth: "", employmentDate: "", password: "", schoolId: "S1" };
export const blankExaminer = { schoolId: "S1", fullname: "", email: "", password: "" };
export const blankExam = { title: "", class: "", classLabel: "", subject: "", subjectId: "", duration: "", scheduledDate: "", passingScore: 0, instructions: "", examType: "WAEC", term: "FIRST", academicSession: "", schoolId: "S1" };