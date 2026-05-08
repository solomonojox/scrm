

export interface SchoolType {
    schoolId: string;
    appCode: string;
    accountId: string;
    registrationNumber: string;
    schoolName: string;
    schoolEmail: string;
    schoolPhone: string;
    address: string;
    typeOfSchool: string;
    countryId: number;
    country: null;
    state: string;
    city: string;
    cac: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    approvalStatus: number;
    approvedBy: string;
    approvalDate: string;
    hasAgreedToTerms: boolean;
    termsAgreementDate: null;
    passwordHash: string;
    registrationDate: string;
    activeSessionKey: null;
    activeSessionTermId: string;
    students: null;
    staffs: null;
    bankAccounts: null;
    schoolFees: null;
    studebntXtraAccount: null;
    subjects: null;
    nappsChapterId: null;
    nappsChapter: null;
    nappsZoneId: null;
    nappsZone: null;
}