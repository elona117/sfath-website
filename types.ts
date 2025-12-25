
export enum ProgramType {
  NEXUS = 'Nexus',
  PRAXIS = 'Praxis',
  EKBALLO = 'Ekballo Lab',
  FELLOWSHIP = 'Fellowship'
}

export interface StatureMetrics {
  doctrine: number;
  weight: number;
  character: number;
  vision: number;
}

export interface Communique {
  id: string;
  type: 'Approval' | 'Rejection' | 'System' | 'Inquiry';
  subject: string;
  content: string;
  timestamp: string;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  program: ProgramType;
  experience: string;
  statement: string;
  status: 'New' | 'Reviewed' | 'Approved' | 'Declined';
  submittedAt: string;
  internalNotes?: string;
  acknowledgmentText?: string;
  communiqueHistory: Communique[];
  stature?: StatureMetrics;
}

export interface WaitlistEntry {
  email: string;
  joinedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'Teaching' | 'Article' | 'Download' | 'Announcement';
  date: string;
  summary: string;
  author?: string;
  fullText?: string;
}

export type ViewState = 'HOME' | 'ABOUT' | 'MANDATE' | 'TRAINING' | 'ADMISSIONS' | 'LEADERSHIP' | 'RESOURCES' | 'ADMIN' | 'PROGRAM_DETAIL' | 'CONTACT' | 'PORTAL';
