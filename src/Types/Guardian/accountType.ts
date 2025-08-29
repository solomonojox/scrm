export interface Account {
  accountId?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  bankCode?: string | null;
  balance?: 0.0;
  createdAt?: string;
  guardianId?: string;
  guardian?: {
    guardianId?: string;
    schoolId?: string;
    firstname?: string;
    lastname?: string;
    relationship?: string;
    phone?: string;
    occupation?: string;
    homeAddress?: string;
    workAddress?: string;
    stateOfOrigin?: string;
    nationality?: string;
    religion?: string;
    email?: string;
    username?: string;
    passwordHash?: string;
    imagePath?: string | null;
    role?: string;
    bvn?: string;
    nin?: string;
    loanAccount?: string | null;
    resetStatus?: number | 0;
    students?: string | null;
    serviceCharges?: string | null;
  };
  transactionReference?: string;
}
