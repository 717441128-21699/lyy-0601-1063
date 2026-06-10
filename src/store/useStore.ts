import { create } from 'zustand';
import type { Job, Company, Resume, Application, FavoriteJob, Interview, Message, FilterOptions } from '../types';
import { jobs as mockJobs, getActiveJobs, getPendingJobs, getJobById, getSimilarJobs, getJobsByCompanyId } from '../data/jobs';
import { companies as mockCompanies, getCompanyById, getApprovedCompanies, getPendingCompanies } from '../data/companies';
import { defaultResume } from '../data/resume';
import { applications as mockApplications, favoriteJobs as mockFavorites } from '../data/applications';
import { interviews as mockInterviews } from '../data/interviews';
import { messages as mockMessages } from '../data/messages';

interface AppState {
  currentUser: { id: string; name: string; role: string } | null;
  jobs: Job[];
  companies: Company[];
  resume: Resume;
  applications: Application[];
  favoriteJobs: FavoriteJob[];
  interviews: Interview[];
  messages: Message[];
  filters: FilterOptions;
  compareList: string[];
  
  setFilters: (filters: FilterOptions) => void;
  getFilteredJobs: () => Job[];
  toggleFavorite: (jobId: string) => void;
  isFavorite: (jobId: string) => boolean;
  addToCompare: (jobId: string) => void;
  removeFromCompare: (jobId: string) => void;
  clearCompare: () => void;
  applyToJob: (jobId: string, resumeType: 'online' | 'attachment') => void;
  hasApplied: (jobId: string) => boolean;
  markMessageAsRead: (messageId: string) => void;
  getUnreadCount: () => number;
  confirmInterview: (interviewId: string) => void;
  rescheduleInterview: (interviewId: string, newTime: string, reason: string) => void;
  getJobById: (id: string) => Job | undefined;
  getCompanyById: (id: string) => Company | undefined;
  getSimilarJobs: (jobId: string, limit?: number) => Job[];
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: { id: 'u1', name: '李明远', role: 'jobseeker' },
  jobs: mockJobs,
  companies: mockCompanies,
  resume: defaultResume,
  applications: mockApplications,
  favoriteJobs: mockFavorites,
  interviews: mockInterviews,
  messages: mockMessages,
  filters: {},
  compareList: [],

  setFilters: (filters) => set({ filters }),

  getFilteredJobs: () => {
    const { jobs, filters } = get();
    let filtered = jobs.filter(j => j.status === 'active');
    
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(keyword) ||
        j.tags.some(t => t.toLowerCase().includes(keyword)) ||
        j.companyId
      );
    }
    
    if (filters.city) {
      filtered = filtered.filter(j => j.location.city === filters.city);
    }
    
    if (filters.experience) {
      filtered = filtered.filter(j => j.experience === filters.experience);
    }
    
    if (filters.education) {
      filtered = filtered.filter(j => j.education === filters.education);
    }
    
    if (filters.salaryMin) {
      filtered = filtered.filter(j => j.salary.max >= filters.salaryMin!);
    }
    
    if (filters.salaryMax) {
      filtered = filtered.filter(j => j.salary.min <= filters.salaryMax!);
    }
    
    return filtered;
  },

  toggleFavorite: (jobId) => {
    const { favoriteJobs, jobs, companies } = get();
    const exists = favoriteJobs.find(f => f.jobId === jobId);
    
    if (exists) {
      set({ favoriteJobs: favoriteJobs.filter(f => f.jobId !== jobId) });
    } else {
      const job = jobs.find(j => j.id === jobId);
      const company = companies.find(c => c.id === job?.companyId);
      if (job && company) {
        const newFavorite: FavoriteJob = {
          id: `f${Date.now()}`,
          userId: 'u1',
          jobId,
          job,
          company,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ favoriteJobs: [...favoriteJobs, newFavorite] });
      }
    }
  },

  isFavorite: (jobId) => {
    return get().favoriteJobs.some(f => f.jobId === jobId);
  },

  addToCompare: (jobId) => {
    const { compareList } = get();
    if (compareList.length < 3 && !compareList.includes(jobId)) {
      set({ compareList: [...compareList, jobId] });
    }
  },

  removeFromCompare: (jobId) => {
    set({ compareList: get().compareList.filter(id => id !== jobId) });
  },

  clearCompare: () => set({ compareList: [] }),

  applyToJob: (jobId, resumeType) => {
    const { applications, jobs, companies } = get();
    const job = jobs.find(j => j.id === jobId);
    const company = companies.find(c => c.id === job?.companyId);
    
    if (job && company && !get().hasApplied(jobId)) {
      const newApplication: Application = {
        id: `app${Date.now()}`,
        userId: 'u1',
        jobId,
        job,
        company,
        resumeType,
        status: 'pending',
        applyDate: new Date().toISOString().split('T')[0],
        timeline: [
          {
            id: `t${Date.now()}`,
            status: '投递成功',
            description: '简历已成功投递，等待HR查看',
            date: new Date().toLocaleString(),
            isCurrent: true,
          },
        ],
      };
      set({ applications: [newApplication, ...applications] });
    }
  },

  hasApplied: (jobId) => {
    return get().applications.some(a => a.jobId === jobId);
  },

  markMessageAsRead: (messageId) => {
    set({
      messages: get().messages.map(m => 
        m.id === messageId ? { ...m, isRead: true } : m
      ),
    });
  },

  getUnreadCount: () => {
    return get().messages.filter(m => !m.isRead).length;
  },

  confirmInterview: (interviewId) => {
    set({
      interviews: get().interviews.map(i =>
        i.id === interviewId ? { ...i, status: 'confirmed' } : i
      ),
    });
  },

  rescheduleInterview: (interviewId, newTime, reason) => {
    set({
      interviews: get().interviews.map(i => {
        if (i.id === interviewId) {
          return {
            ...i,
            status: 'rescheduled' as const,
            rescheduleHistory: [
              ...i.rescheduleHistory,
              {
                id: `rs${Date.now()}`,
                originalTime: i.time,
                newTime,
                reason,
                status: 'pending' as const,
                applyDate: new Date().toISOString().split('T')[0],
              },
            ],
          };
        }
        return i;
      }),
    });
  },

  getJobById: (id) => getJobById(id),
  getCompanyById: (id) => getCompanyById(id),
  getSimilarJobs: (jobId, limit) => getSimilarJobs(jobId, limit),
}));
