// data.ts
import { StudentPromotionType, ClassPromotion } from "./student-promotion-type";

export const CLASSES: ClassPromotion[] = [
  { id: "c1", name: "Grade 1A", level: "Grade 1", teacher: "Ms. Adaeze Obi", count: 28 },
  { id: "c2", name: "Grade 1B", level: "Grade 1", teacher: "Mr. Emeka Nwosu", count: 30 },
  { id: "c3", name: "Grade 2A", level: "Grade 2", teacher: "Ms. Fatima Bello", count: 27 },
  { id: "c4", name: "Grade 2B", level: "Grade 2", teacher: "Mr. Samuel Okafor", count: 29 },
  { id: "c5", name: "Grade 3A", level: "Grade 3", teacher: "Ms. Ngozi Eze", count: 31 },
  { id: "c6", name: "Grade 3B", level: "Grade 3", teacher: "Mr. Chidi Amara", count: 26 },
];

export const STUDENTS_BY_CLASS: Record<string, StudentPromotionType[]> = {
  c1: [
    { id: "s1", name: "Amara Okonkwo", gender: "F", dob: "2017-03-12", guardianName: "Mr. Okonkwo", status: "Active" },
    { id: "s2", name: "Tunde Adesanya", gender: "M", dob: "2017-07-24", guardianName: "Mrs. Adesanya", status: "Active" },
    { id: "s3", name: "Chisom Ezeh", gender: "F", dob: "2017-01-09", guardianName: "Mr. Ezeh", status: "Active" },
    { id: "s4", name: "Obinna Nwosu", gender: "M", dob: "2017-05-18", guardianName: "Mrs. Nwosu", status: "Active" },
    { id: "s5", name: "Adaeze Mba", gender: "F", dob: "2017-11-30", guardianName: "Mr. Mba", status: "Active" },
    { id: "s6", name: "Emeka Ibe", gender: "M", dob: "2017-08-14", guardianName: "Mrs. Ibe", status: "Active" },
    { id: "s7", name: "Uju Okoro", gender: "F", dob: "2017-04-02", guardianName: "Mr. Okoro", status: "Active" },
    { id: "s8", name: "Kelechi Nze", gender: "M", dob: "2017-10-21", guardianName: "Mrs. Nze", status: "Active" },
    { id: "s9", name: "Blessing Achike", gender: "F", dob: "2017-02-16", guardianName: "Mr. Achike", status: "Active" },
    { id: "s10", name: "Ifeanyi Ogbu", gender: "M", dob: "2017-09-07", guardianName: "Mrs. Ogbu", status: "Active" },
    { id: "s11", name: "Chinwe Uzo", gender: "F", dob: "2017-06-25", guardianName: "Mr. Uzo", status: "Active" },
    { id: "s12", name: "Somto Dike", gender: "M", dob: "2017-12-03", guardianName: "Mrs. Dike", status: "Active" },
  ],
  c2: [
    { id: "s13", name: "Aisha Garba", gender: "F", dob: "2017-04-19", guardianName: "Mr. Garba", status: "Active" },
    { id: "s14", name: "Musa Danladi", gender: "M", dob: "2017-08-07", guardianName: "Mrs. Danladi", status: "Active" },
    { id: "s15", name: "Fatima Sule", gender: "F", dob: "2017-01-31", guardianName: "Mr. Sule", status: "Active" },
    { id: "s16", name: "Ibrahim Bello", gender: "M", dob: "2017-11-14", guardianName: "Mrs. Bello", status: "Active" },
    { id: "s17", name: "Hauwa Aliyu", gender: "F", dob: "2017-06-09", guardianName: "Mr. Aliyu", status: "Active" },
    { id: "s18", name: "Yusuf Tanko", gender: "M", dob: "2017-03-28", guardianName: "Mrs. Tanko", status: "Active" },
    { id: "s19", name: "Ramatu Hassan", gender: "F", dob: "2017-09-15", guardianName: "Mr. Hassan", status: "Active" },
    { id: "s20", name: "Abdullahi Lawan", gender: "M", dob: "2017-07-02", guardianName: "Mrs. Lawan", status: "Active" },
  ],
  c3: [
    { id: "s21", name: "Olusegun Adeyemi", gender: "M", dob: "2016-05-11", guardianName: "Mrs. Adeyemi", status: "Active" },
    { id: "s22", name: "Funmilayo Ogun", gender: "F", dob: "2016-10-23", guardianName: "Mr. Ogun", status: "Active" },
    { id: "s23", name: "Babatunde Lawal", gender: "M", dob: "2016-02-08", guardianName: "Mrs. Lawal", status: "Active" },
    { id: "s24", name: "Iyabo Fashola", gender: "F", dob: "2016-07-17", guardianName: "Mr. Fashola", status: "Active" },
    { id: "s25", name: "Segun Olawale", gender: "M", dob: "2016-12-30", guardianName: "Mrs. Olawale", status: "Active" },
    { id: "s26", name: "Yetunde Afolabi", gender: "F", dob: "2016-04-06", guardianName: "Mr. Afolabi", status: "Active" },
  ],
  c4: [
    { id: "s27", name: "Emmanuel Obi", gender: "M", dob: "2016-08-22", guardianName: "Mrs. Obi", status: "Active" },
    { id: "s28", name: "Grace Okorie", gender: "F", dob: "2016-03-14", guardianName: "Mr. Okorie", status: "Active" },
    { id: "s29", name: "Precious Nwachukwu", gender: "F", dob: "2016-11-01", guardianName: "Mrs. Nwachukwu", status: "Active" },
    { id: "s30", name: "Daniel Ugwu", gender: "M", dob: "2016-06-18", guardianName: "Mr. Ugwu", status: "Active" },
  ],
  c5: [],
  c6: [],
};

export const NAV = [
  { icon: "LayoutDashboard", label: "Dashboard" },
  { icon: "Users", label: "Students" },
  { icon: "BookOpen", label: "Classes" },
  { icon: "GraduationCap", label: "Promotions", active: true },
  { icon: "BarChart3", label: "Reports" },
  { icon: "Settings", label: "Settings" },
];
