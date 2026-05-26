export interface Student {
  name: string;
  rollNo: string;
  password: string;
  fatherNo: string;
  department: string;
  semester: number;
  fineAmount: number;
  fineStatus: 'paid' | 'unpaid';
  isCleared: boolean;
  /**
   * Set by the teacher when they update fines / student record.
   * Used by the student dashboard to show who to contact.
   */
  updatedByTeacherName?: string;
  updatedByTeacherPhoneNo?: string;
  createdAt: Date;
}