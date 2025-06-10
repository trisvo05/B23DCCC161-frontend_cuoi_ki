type Application = {
  id: number;
  studentName: string;
  studentId: string;
  school: string;
  major: string;
  batch: string;
  status: string;
  submittedDate: string;
  phone: string;
  email: string;
  address: string;
  gpa: number;
  documents: { name: string; url: string }[];
};