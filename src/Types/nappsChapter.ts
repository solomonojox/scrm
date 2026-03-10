export interface NappsChapter {
  id: string;
  name: string;
  state: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string | null;
  chapterAdmins: any[];
  schools: any[];
}
