import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Job,
  Company,
  Resume,
  Application,
  FavoriteJob,
  Interview,
  Message,
  FilterOptions,
  ChatConversation,
  Report,
  AttachmentItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from '../types';
import { jobs as mockJobs, getSimilarJobs } from '../data/jobs';
import { companies as mockCompanies } from '../data/companies';
import { defaultResume, calculateCompleteness } from '../data/resume';
import { applications as mockApplications, favoriteJobs as mockFavorites } from '../data/applications';
import { interviews as mockInterviews } from '../data/interviews';
import {
  messages as mockMessages,
  chatConversations as mockChatConversations,
  reports as mockReports,
} from '../data/messages';

interface AppState {
  currentUser: { id: string; name: string; role: string } | null;
  jobs: Job[];
  companies: Company[];
  resume: Resume;
  applications: Application[];
  favoriteJobs: FavoriteJob[];
  interviews: Interview[];
  messages: Message[];
  chatConversations: ChatConversation[];
  reports: Report[];
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

  updateResumeBasicInfo: (info: Partial<Resume['basicInfo']>) => void;
  updateJobIntention: (intention: Partial<Resume['jobIntention']>) => void;
  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  addExperience: (item: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  addProject: (item: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, item: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  updateSelfIntroduction: (text: string) => void;
  addAttachment: (attachment: Omit<AttachmentItem, 'id'>) => void;
  deleteAttachment: (id: string) => void;
  setVisibility: (visibility: Resume['visibility']) => void;

  sendChatMessage: (conversationId: string, content: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  getChatUnreadCount: () => number;

  approveCompany: (companyId: string) => void;
  rejectCompany: (companyId: string) => void;
  approveJob: (jobId: string) => void;
  rejectJob: (jobId: string) => void;
  offlineJob: (jobId: string) => void;
  resolveReport: (reportId: string) => void;
  rejectReport: (reportId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: { id: 'u1', name: '李明远', role: 'jobseeker' },
      jobs: mockJobs,
      companies: mockCompanies,
      resume: defaultResume,
      applications: mockApplications,
      favoriteJobs: mockFavorites,
      interviews: mockInterviews,
      messages: mockMessages,
      chatConversations: mockChatConversations,
      reports: mockReports,
      filters: {},
      compareList: [],

      setFilters: (filters) => set({ filters }),

      getFilteredJobs: () => {
        const { jobs, filters } = get();
        let filtered = jobs.filter((j) => j.status === 'active');

        if (filters.keyword) {
          const keyword = filters.keyword.toLowerCase();
          filtered = filtered.filter(
            (j) =>
              j.title.toLowerCase().includes(keyword) ||
              j.tags.some((t) => t.toLowerCase().includes(keyword)) ||
              j.companyId
          );
        }

        if (filters.city) {
          filtered = filtered.filter((j) => j.location.city === filters.city);
        }

        if (filters.experience) {
          filtered = filtered.filter((j) => j.experience === filters.experience);
        }

        if (filters.education) {
          filtered = filtered.filter((j) => j.education === filters.education);
        }

        if (filters.salaryMin) {
          filtered = filtered.filter((j) => j.salary.max >= filters.salaryMin!);
        }

        if (filters.salaryMax) {
          filtered = filtered.filter((j) => j.salary.min <= filters.salaryMax!);
        }

        return filtered;
      },

      toggleFavorite: (jobId) => {
        const { favoriteJobs, jobs, companies } = get();
        const exists = favoriteJobs.find((f) => f.jobId === jobId);

        if (exists) {
          set({ favoriteJobs: favoriteJobs.filter((f) => f.jobId !== jobId) });
        } else {
          const job = jobs.find((j) => j.id === jobId);
          const company = companies.find((c) => c.id === job?.companyId);
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
        return get().favoriteJobs.some((f) => f.jobId === jobId);
      },

      addToCompare: (jobId) => {
        const { compareList } = get();
        if (compareList.length < 3 && !compareList.includes(jobId)) {
          set({ compareList: [...compareList, jobId] });
        }
      },

      removeFromCompare: (jobId) => {
        set({ compareList: get().compareList.filter((id) => id !== jobId) });
      },

      clearCompare: () => set({ compareList: [] }),

      applyToJob: (jobId, resumeType) => {
        const { applications, jobs, companies } = get();
        const job = jobs.find((j) => j.id === jobId);
        const company = companies.find((c) => c.id === job?.companyId);

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
        return get().applications.some((a) => a.jobId === jobId);
      },

      markMessageAsRead: (messageId) => {
        set({
          messages: get().messages.map((m) =>
            m.id === messageId ? { ...m, isRead: true } : m
          ),
        });
      },

      getUnreadCount: () => {
        return get().messages.filter((m) => !m.isRead).length;
      },

      confirmInterview: (interviewId) => {
        set({
          interviews: get().interviews.map((i) =>
            i.id === interviewId ? { ...i, status: 'confirmed' as const } : i
          ),
        });
      },

      rescheduleInterview: (interviewId, newTime, reason) => {
        set({
          interviews: get().interviews.map((i) => {
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

      getJobById: (id) => get().jobs.find((j) => j.id === id),
      getCompanyById: (id) => get().companies.find((c) => c.id === id),
      getSimilarJobs: (jobId, limit) => getSimilarJobs(jobId, limit),

      updateResumeBasicInfo: (info) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            basicInfo: { ...state.resume.basicInfo, ...info },
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      updateJobIntention: (intention) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            jobIntention: { ...state.resume.jobIntention, ...intention },
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      addEducation: (item) => {
        set((state) => {
          const newItem = { ...item, id: `e${Date.now()}` } as EducationItem;
          const newResume = {
            ...state.resume,
            education: [...state.resume.education, newItem],
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      updateEducation: (id, item) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            education: state.resume.education.map((e) =>
              e.id === id ? { ...e, ...item } : e
            ),
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      deleteEducation: (id) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            education: state.resume.education.filter((e) => e.id !== id),
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      addExperience: (item) => {
        set((state) => {
          const newItem = { ...item, id: `exp${Date.now()}` } as ExperienceItem;
          const newResume = {
            ...state.resume,
            experience: [...state.resume.experience, newItem],
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      updateExperience: (id, item) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            experience: state.resume.experience.map((e) =>
              e.id === id ? { ...e, ...item } : e
            ),
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      deleteExperience: (id) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            experience: state.resume.experience.filter((e) => e.id !== id),
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      addProject: (item) => {
        set((state) => {
          const newItem = { ...item, id: `p${Date.now()}` } as ProjectItem;
          const newResume = {
            ...state.resume,
            projects: [...state.resume.projects, newItem],
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      updateProject: (id, item) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            projects: state.resume.projects.map((p) =>
              p.id === id ? { ...p, ...item } : p
            ),
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      deleteProject: (id) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            projects: state.resume.projects.filter((p) => p.id !== id),
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      addSkill: (skill) => {
        set((state) => {
          if (state.resume.skills.includes(skill)) return state;
          const newResume = {
            ...state.resume,
            skills: [...state.resume.skills, skill],
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      removeSkill: (skill) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            skills: state.resume.skills.filter((s) => s !== skill),
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      updateSelfIntroduction: (text) => {
        set((state) => {
          const newResume = {
            ...state.resume,
            selfIntroduction: text,
          };
          newResume.completeness = calculateCompleteness(newResume);
          return { resume: newResume };
        });
      },

      addAttachment: (attachment) => {
        set((state) => {
          const newAttachment = {
            ...attachment,
            id: `att${Date.now()}`,
          } as AttachmentItem;
          return {
            resume: {
              ...state.resume,
              attachments: [...state.resume.attachments, newAttachment],
            },
          };
        });
      },

      deleteAttachment: (id) => {
        set((state) => ({
          resume: {
            ...state.resume,
            attachments: state.resume.attachments.filter((a) => a.id !== id),
          },
        }));
      },

      setVisibility: (visibility) => {
        set((state) => ({
          resume: { ...state.resume, visibility },
        }));
      },

      sendChatMessage: (conversationId, content) => {
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        set((state) => {
          const newMessage: Message = {
            id: `msg${Date.now()}`,
            type: 'chat',
            senderId: 'u1',
            senderName: state.currentUser?.name || '我',
            senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
            receiverId: conversationId,
            title: '',
            content,
            isRead: true,
            createdAt: timeStr,
          };

          const updatedConversations = state.chatConversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: content,
                  lastMessageTime: timeStr,
                  unreadCount: 0,
                }
              : c
          );

          return {
            messages: [newMessage, ...state.messages],
            chatConversations: updatedConversations,
          };
        });
      },

      markConversationAsRead: (conversationId) => {
        set((state) => ({
          chatConversations: state.chatConversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
        }));
      },

      getChatUnreadCount: () => {
        return get().chatConversations.reduce((sum, c) => sum + c.unreadCount, 0);
      },

      approveCompany: (companyId) => {
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === companyId ? { ...c, status: 'approved' as const } : c
          ),
        }));
      },

      rejectCompany: (companyId) => {
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === companyId ? { ...c, status: 'rejected' as const } : c
          ),
        }));
      },

      approveJob: (jobId) => {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'active' as const } : j
          ),
        }));
      },

      rejectJob: (jobId) => {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'rejected' as const } : j
          ),
        }));
      },

      offlineJob: (jobId) => {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'offline' as const } : j
          ),
        }));
      },

      resolveReport: (reportId) => {
        const now = new Date().toISOString().split('T')[0];
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === reportId
              ? { ...r, status: 'resolved' as const, handledAt: now, handlerId: 'admin1' }
              : r
          ),
        }));
      },

      rejectReport: (reportId) => {
        const now = new Date().toISOString().split('T')[0];
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === reportId
              ? { ...r, status: 'rejected' as const, handledAt: now, handlerId: 'admin1' }
              : r
          ),
        }));
      },
    }),
    {
      name: 'job-platform-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resume: state.resume,
        applications: state.applications,
        favoriteJobs: state.favoriteJobs,
        interviews: state.interviews,
        messages: state.messages,
        chatConversations: state.chatConversations,
        reports: state.reports,
        jobs: state.jobs,
        companies: state.companies,
      }),
    }
  )
);
