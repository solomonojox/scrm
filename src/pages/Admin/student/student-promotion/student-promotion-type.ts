// types.ts
export interface StudentPromotionType {
  id: string;
  name: string;
  gender: "M" | "F";
  dob: string;
  guardianName: string;
  status: string;
}

export interface ClassPromotion {
  id: string;
  name: string;
  level: string;
  teacher: string;
  count: number;
}
