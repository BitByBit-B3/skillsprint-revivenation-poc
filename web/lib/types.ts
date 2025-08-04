export interface AuthClaims {
  sub: string;
  name?: string;
  email?: string;
}

export interface EducationRecord {
  fullName: string;
  qualifications: {
    institution: string;
    program: string;
    year: number;
    skills: string[];
  }[];
}

export interface Gig {
  id: string;
  title: string;
  payoutLKR: number;
  skills: string[];
}

export interface PayoutResponse {
  payoutId: string;
  status: string;
}

export interface PayoutStatus {
  payoutId: string;
  status: 'initiated' | 'settled' | 'failed';
  timestamp?: string;
}