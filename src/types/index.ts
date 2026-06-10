export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: 'jobseeker' | 'employer' | 'admin';
  status: 'active' | 'inactive';
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  industry: string;
  scale: string;
  description: string;
  certification: {
    hasCertified: boolean;
    creditCode: string;
    establishDate: string;
    legalPerson: string;
    registeredCapital: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  jobCount: number;
  location: string;
  website?: string;
  companyPhotos: string[];
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  salary: {
    min: number;
    max: number;
    type: 'monthly' | 'yearly';
  };
  location: {
    city: string;
    district: string;
    address: string;
  };
  experience: string;
  education: string;
  tags: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'pending' | 'active' | 'offline' | 'rejected';
  publishDate: string;
  viewCount: number;
  applyCount: number;
  recruiterName: string;
  recruiterTitle: string;
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  url: string;
}

export interface TimelineItem {
  id: string;
  status: string;
  description: string;
  date: string;
  isCurrent?: boolean;
}

export interface Resume {
  id: string;
  userId: string;
  basicInfo: {
    name: string;
    avatar: string;
    gender: string;
    age: number;
    phone: string;
    email: string;
    location: string;
    workYears: number;
    jobStatus: string;
  };
  jobIntention: {
    position: string;
    salaryMin: number;
    salaryMax: number;
    city: string;
    status: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: string[];
  selfIntroduction?: string;
  attachments: AttachmentItem[];
  completeness: number;
  visibility: 'public' | 'applied' | 'private';
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  company: Company;
  resumeType: 'online' | 'attachment';
  status: 'pending' | 'reviewing' | 'interview' | 'offer' | 'rejected';
  applyDate: string;
  timeline: TimelineItem[];
}

export interface RescheduleItem {
  id: string;
  originalTime: string;
  newTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  applyDate: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  userId: string;
  companyId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  time: string;
  endTime: string;
  type: 'onsite' | 'video' | 'phone';
  interviewer: string;
  interviewerTitle: string;
  location: string;
  meetingLink?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
  rescheduleHistory: RescheduleItem[];
  round: number;
}

export interface Message {
  id: string;
  type: 'system' | 'interview' | 'application' | 'chat';
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
  relatedType?: string;
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantType: 'hr' | 'jobseeker';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  jobTitle?: string;
}

export interface Report {
  id: string;
  type: 'job' | 'company' | 'user';
  targetId: string;
  targetName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt: string;
  handledAt?: string;
  handlerId?: string;
}

export interface FavoriteJob {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  company: Company;
  createdAt: string;
}

export interface FilterOptions {
  keyword?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
  education?: string;
  companySize?: string;
  industry?: string;
  jobType?: string;
  publishDate?: string;
}

export interface AdminStats {
  totalCompanies: number;
  pendingCompanies: number;
  totalJobs: number;
  pendingJobs: number;
  totalUsers: number;
  totalReports: number;
  pendingReports: number;
  todayApplications: number;
  weeklyTrend: {
    date: string;
    applications: number;
    jobs: number;
  }[];
}
