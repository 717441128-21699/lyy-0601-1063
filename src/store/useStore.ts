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
  AuditLog,
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
  auditLogs: AuditLog[];
  filters: FilterOptions;
  compareList: string[];

  setFilters: (filters: FilterOptions) => void;
  getFilteredJobs: () => Job[];
  toggleFavorite: (jobId: string) => void;
  isFavorite: (jobId: string) => boolean;
  addToCompare: (jobId: string) => void;
  removeFromCompare: (jobId: string) => void;
  clearCompare: () => void;
  applyToJob: (jobId: string, resumeType: 'online' | 'attachment', attachmentId?: string) => void;
  hasApplied: (jobId: string) => boolean;
  updateApplicationStatus: (applicationId: string, status: Application['status'], description?: string) => void;
  createInterview: (applicationId: string, interviewData: Omit<Interview, 'id' | 'applicationId' | 'userId' | 'status' | 'rescheduleHistory'>) => void;
  markMessageAsRead: (messageId: string) => void;
  getUnreadCount: () => number;
  getTotalUnreadCount: () => number;
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

  submitReport: (report: Omit<Report, 'id' | 'status' | 'createdAt'>) => boolean;
  hasReported: (targetId: string, type: Report['type']) => boolean;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;

  approveCompany: (companyId: string) => void;
  rejectCompany: (companyId: string) => void;
  offlineCompany: (companyId: string) => void;
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
      auditLogs: [],
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

      applyToJob: (jobId, resumeType, attachmentId) => {
        const { applications, jobs, companies, resume } = get();
        const job = jobs.find((j) => j.id === jobId);
        const company = companies.find((c) => c.id === job?.companyId);
        const attachment = attachmentId ? resume.attachments.find((a) => a.id === attachmentId) : undefined;

        if (job && company && !get().hasApplied(jobId)) {
          const newApplication: Application = {
            id: `app${Date.now()}`,
            userId: 'u1',
            jobId,
            job,
            company,
            resumeType,
            attachmentId,
            attachmentName: attachment?.name,
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

      updateApplicationStatus: (applicationId, status, description) => {
        const statusLabels: Record<string, string> = {
          pending: '投递成功',
          reviewing: '简历筛选中',
          interview: '面试中',
          offer: '已发Offer',
          rejected: '未通过',
        };
        const defaultDescriptions: Record<string, string> = {
          reviewing: 'HR正在查看您的简历',
          interview: 'HR已邀请您参加面试，请查看面试安排',
          offer: '恭喜您！HR已向您发出Offer',
          rejected: '很遗憾，您的简历未通过筛选',
        };

        set((state) => {
          const updatedApplications = state.applications.map((app) => {
            if (app.id !== applicationId) return app;
            const newTimeline = app.timeline.map((t) => ({ ...t, isCurrent: false }));
            newTimeline.push({
              id: `t${Date.now()}`,
              status: statusLabels[status] || status,
              description: description || defaultDescriptions[status] || '',
              date: new Date().toLocaleString(),
              isCurrent: true,
            });
            return { ...app, status, timeline: newTimeline };
          });

          let newMessages = [...state.messages];
          const app = state.applications.find((a) => a.id === applicationId);
          if (app && ['reviewing', 'interview', 'offer', 'rejected'].includes(status)) {
            const msgType = status === 'interview' ? 'interview' : status === 'offer' ? 'system' : 'application';
            newMessages = [
              {
                id: `msg${Date.now()}`,
                type: msgType as 'system' | 'interview' | 'application',
                senderId: app.company.id,
                senderName: app.company.name,
                senderAvatar: app.company.logo,
                receiverId: 'u1',
                title:
                  status === 'reviewing'
                    ? '简历筛选通知'
                    : status === 'interview'
                    ? '面试邀约通知'
                    : status === 'offer'
                    ? 'Offer通知'
                    : '投递结果通知',
                content:
                  status === 'reviewing'
                    ? `您投递的「${app.job.title}」简历正在被HR查看`
                    : status === 'interview'
                    ? `您投递的「${app.job.title}」已进入面试阶段，请查看面试安排`
                    : status === 'offer'
                    ? `恭喜！您投递的「${app.job.title}」已发出Offer`
                    : `很遗憾，您投递的「${app.job.title}」未通过筛选`,
                isRead: false,
                createdAt: new Date().toLocaleString(),
                relatedId: applicationId,
                relatedType: 'application',
              },
              ...newMessages,
            ];
          }

          return { applications: updatedApplications, messages: newMessages };
        });
      },

      createInterview: (applicationId, interviewData) => {
        set((state) => {
          const app = state.applications.find((a) => a.id === applicationId);
          if (!app) return state;

          const newInterview: Interview = {
            ...interviewData,
            id: `int${Date.now()}`,
            applicationId,
            userId: 'u1',
            status: 'pending',
            rescheduleHistory: [],
          };

          const updatedApplications = state.applications.map((a) => {
            if (a.id !== applicationId) return a;
            const newTimeline = a.timeline.map((t) => ({ ...t, isCurrent: false }));
            newTimeline.push({
              id: `t${Date.now()}`,
              status: '面试中',
              description: `HR已邀请您参加${interviewData.type === 'onsite' ? '现场' : interviewData.type === 'video' ? '视频' : '电话'}面试`,
              date: new Date().toLocaleString(),
              isCurrent: true,
            });
            return { ...a, status: 'interview' as const, timeline: newTimeline };
          });

          const interviewMsg: Message = {
            id: `msg${Date.now() + 1}`,
            type: 'interview',
            senderId: app.company.id,
            senderName: app.company.name,
            senderAvatar: app.company.logo,
            receiverId: 'u1',
            title: '面试邀约',
            content: `${app.company.name}邀请您参加「${app.job.title}」的${interviewData.type === 'onsite' ? '现场' : interviewData.type === 'video' ? '视频' : '电话'}面试，时间：${interviewData.time}`,
            isRead: false,
            createdAt: new Date().toLocaleString(),
            relatedId: newInterview.id,
            relatedType: 'interview',
          };

          return {
            interviews: [newInterview, ...state.interviews],
            applications: updatedApplications,
            messages: [interviewMsg, ...state.messages],
          };
        });
      },

      markMessageAsRead: (messageId) => {
        set({
          messages: get().messages.map((m) =>
            m.id === messageId ? { ...m, isRead: true } : m
          ),
        });
      },

      getUnreadCount: () => {
        return get().messages.filter((m) => !m.isRead && m.type !== 'chat').length;
      },

      getTotalUnreadCount: () => {
        const messageUnread = get().messages.filter((m) => !m.isRead && m.type !== 'chat').length;
        const chatUnread = get().chatConversations.reduce((sum, c) => sum + c.unreadCount, 0);
        return messageUnread + chatUnread;
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
                time: newTime,
                status: 'rescheduled' as const,
                rescheduleHistory: [
                  ...i.rescheduleHistory,
                  {
                    id: `rs${Date.now()}`,
                    originalTime: i.time,
                    newTime,
                    reason,
                    status: 'approved' as const,
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

          return {
            messages: [...state.messages, newMessage],
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

      submitReport: (reportData) => {
        const { reports, currentUser, jobs, companies } = get();
        const duplicate = reports.find(
          (r) => r.targetId === reportData.targetId && r.type === reportData.type && r.reporterId === reportData.reporterId
        );
        if (duplicate) return false;

        let targetName = reportData.targetName;
        if (reportData.type === 'job') {
          const job = jobs.find((j) => j.id === reportData.targetId);
          if (job) targetName = job.title;
        } else if (reportData.type === 'company') {
          const company = companies.find((c) => c.id === reportData.targetId);
          if (company) targetName = company.name;
        }

        const newReport: Report = {
          ...reportData,
          id: `rpt${Date.now()}`,
          targetName,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ reports: [newReport, ...reports] });
        return true;
      },

      hasReported: (targetId, type) => {
        const { reports, currentUser } = get();
        return reports.some(
          (r) => r.targetId === targetId && r.type === type && r.reporterId === (currentUser?.id || 'u1')
        );
      },

      addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        set((state) => ({
          auditLogs: [
            {
              ...log,
              id: `log${Date.now()}`,
              timestamp: new Date().toLocaleString(),
            },
            ...state.auditLogs,
          ],
        }));
      },

      approveCompany: (companyId) => {
        const { companies, currentUser } = get();
        const company = companies.find((c) => c.id === companyId);
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === companyId ? { ...c, status: 'approved' as const } : c
          ),
        }));
        if (company) {
          get().addAuditLog({
            operatorId: currentUser?.id || 'admin1',
            operatorName: currentUser?.name || '管理员',
            targetType: 'company',
            targetId: companyId,
            targetName: company.name,
            action: '通过',
          });
        }
      },

      rejectCompany: (companyId) => {
        const { companies, currentUser } = get();
        const company = companies.find((c) => c.id === companyId);
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === companyId ? { ...c, status: 'rejected' as const } : c
          ),
        }));
        if (company) {
          get().addAuditLog({
            operatorId: currentUser?.id || 'admin1',
            operatorName: currentUser?.name || '管理员',
            targetType: 'company',
            targetId: companyId,
            targetName: company.name,
            action: '拒绝',
          });
        }
      },

      offlineCompany: (companyId) => {
        const { companies, currentUser } = get();
        const company = companies.find((c) => c.id === companyId);
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === companyId ? { ...c, status: 'rejected' as const } : c
          ),
        }));
        if (company) {
          get().addAuditLog({
            operatorId: currentUser?.id || 'admin1',
            operatorName: currentUser?.name || '管理员',
            targetType: 'company',
            targetId: companyId,
            targetName: company.name,
            action: '下架',
          });
        }
      },

      approveJob: (jobId) => {
        const { jobs, currentUser } = get();
        const job = jobs.find((j) => j.id === jobId);
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'active' as const } : j
          ),
        }));
        if (job) {
          get().addAuditLog({
            operatorId: currentUser?.id || 'admin1',
            operatorName: currentUser?.name || '管理员',
            targetType: 'job',
            targetId: jobId,
            targetName: job.title,
            action: '通过上架',
          });
        }
      },

      rejectJob: (jobId) => {
        const { jobs, currentUser } = get();
        const job = jobs.find((j) => j.id === jobId);
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'rejected' as const } : j
          ),
        }));
        if (job) {
          get().addAuditLog({
            operatorId: currentUser?.id || 'admin1',
            operatorName: currentUser?.name || '管理员',
            targetType: 'job',
            targetId: jobId,
            targetName: job.title,
            action: '拒绝',
          });
        }
      },

      offlineJob: (jobId) => {
        const { jobs, currentUser } = get();
        const job = jobs.find((j) => j.id === jobId);
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'offline' as const } : j
          ),
        }));
        if (job) {
          get().addAuditLog({
            operatorId: currentUser?.id || 'admin1',
            operatorName: currentUser?.name || '管理员',
            targetType: 'job',
            targetId: jobId,
            targetName: job.title,
            action: '下架',
          });
        }
      },

      resolveReport: (reportId) => {
        const now = new Date().toISOString().split('T')[0];
        const { reports, currentUser } = get();
        const report = reports.find((r) => r.id === reportId);
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === reportId
              ? { ...r, status: 'resolved' as const, handledAt: now, handlerId: currentUser?.id || 'admin1' }
              : r
          ),
        }));
        if (report) {
          get().addAuditLog({
            operatorId: currentUser?.id || 'admin1',
            operatorName: currentUser?.name || '管理员',
            targetType: 'report',
            targetId: reportId,
            targetName: `举报：${report.targetName}`,
            action: '处理',
          });
        }
      },

      rejectReport: (reportId) => {
        const now = new Date().toISOString().split('T')[0];
        const { reports, currentUser } = get();
        const report = reports.find((r) => r.id === reportId);
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === reportId
              ? { ...r, status: 'rejected' as const, handledAt: now, handlerId: currentUser?.id || 'admin1' }
              : r
          ),
        }));
        if (report) {
          get().addAuditLog({
            operatorId: currentUser?.id || 'admin1',
            operatorName: currentUser?.name || '管理员',
            targetType: 'report',
            targetId: reportId,
            targetName: `举报：${report.targetName}`,
            action: '驳回',
          });
        }
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
        auditLogs: state.auditLogs,
        jobs: state.jobs,
        companies: state.companies,
      }),
    }
  )
);
