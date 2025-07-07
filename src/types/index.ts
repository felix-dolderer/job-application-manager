export interface JobApplication {
  id?: number;
  company_name: string;
  position_title: string;
  job_description?: string;
  salary_range?: string;
  location?: string;
  application_date: string;
  status: ApplicationStatus;
  application_url?: string;
  contact_person?: string;
  contact_email?: string;
  notes?: string;
  interview_date?: string;
  follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}

export type ApplicationStatus = 
  | 'Applied'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Waiting for Response'
  | 'Offer Received'
  | 'Rejected'
  | 'Withdrawn';

export interface Statistics {
  total: number;
  byStatus: { status: string; count: number }[];
  recentApplications: { date: string; count: number }[];
}

export interface FilterOptions {
  status?: ApplicationStatus;
  company?: string;
  search?: string;
}