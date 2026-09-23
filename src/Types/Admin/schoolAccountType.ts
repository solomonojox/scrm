export interface SchoolAccountType {
  schoolAccountId: string;
  schoolId: string;
  bankName: string;
  bankCode?: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  createdAt: string;
  school?: any | null;
}