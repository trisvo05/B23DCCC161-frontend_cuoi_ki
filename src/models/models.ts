  interface Major {
    id: number;
    name: string;
  }

  interface SubjectCombination {
    id: number;
    code: string;
    subjects: string;
  }
  interface ApplicationRecord {
    fullName?: string;
    dob: string;
    address: string;
    score: number;
    priorityObject: string;
    status: 'pending' | 'approved' | 'rejected';
  }