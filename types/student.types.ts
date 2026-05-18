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
  createdAt: Date;
}