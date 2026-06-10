import type { Application, FavoriteJob } from '../types';
import { jobs, getJobById } from './jobs';
import { companies, getCompanyById } from './companies';

export const applications: Application[] = [
  {
    id: 'app1',
    userId: 'u1',
    jobId: 'j1',
    job: jobs.find(j => j.id === 'j1')!,
    company: companies.find(c => c.id === 'c1')!,
    resumeType: 'online',
    status: 'interview',
    applyDate: '2026-06-08',
    timeline: [
      { id: 't1', status: '投递成功', description: '简历已成功投递', date: '2026-06-08 10:30', isCurrent: false },
      { id: 't2', status: '简历筛选中', description: 'HR正在查看您的简历', date: '2026-06-08 14:20', isCurrent: false },
      { id: 't3', status: '简历通过', description: '简历通过初筛，等待面试安排', date: '2026-06-09 09:15', isCurrent: false },
      { id: 't4', status: '面试安排中', description: 'HR已发起面试邀请，请确认', date: '2026-06-10 16:40', isCurrent: true },
    ],
  },
  {
    id: 'app2',
    userId: 'u1',
    jobId: 'j3',
    job: jobs.find(j => j.id === 'j3')!,
    company: companies.find(c => c.id === 'c2')!,
    resumeType: 'online',
    status: 'reviewing',
    applyDate: '2026-06-07',
    timeline: [
      { id: 't1', status: '投递成功', description: '简历已成功投递', date: '2026-06-07 09:15', isCurrent: false },
      { id: 't2', status: '简历筛选中', description: 'HR正在查看您的简历', date: '2026-06-07 15:30', isCurrent: true },
    ],
  },
  {
    id: 'app3',
    userId: 'u1',
    jobId: 'j7',
    job: jobs.find(j => j.id === 'j7')!,
    company: companies.find(c => c.id === 'c4')!,
    resumeType: 'attachment',
    status: 'offer',
    applyDate: '2026-05-28',
    timeline: [
      { id: 't1', status: '投递成功', description: '简历已成功投递', date: '2026-05-28 11:00', isCurrent: false },
      { id: 't2', status: '简历筛选中', description: 'HR正在查看您的简历', date: '2026-05-29 10:20', isCurrent: false },
      { id: 't3', status: '简历通过', description: '简历通过初筛', date: '2026-05-30 14:00', isCurrent: false },
      { id: 't4', status: '一轮面试', description: '技术面试已完成', date: '2026-06-02 10:00', isCurrent: false },
      { id: 't5', status: '二轮面试', description: '总监面试已完成', date: '2026-06-05 15:30', isCurrent: false },
      { id: 't6', status: '已发Offer', description: '恭喜您获得Offer，请查收', date: '2026-06-09 11:00', isCurrent: true },
    ],
  },
  {
    id: 'app4',
    userId: 'u1',
    jobId: 'j12',
    job: jobs.find(j => j.id === 'j12')!,
    company: companies.find(c => c.id === 'c8')!,
    resumeType: 'online',
    status: 'rejected',
    applyDate: '2026-06-02',
    timeline: [
      { id: 't1', status: '投递成功', description: '简历已成功投递', date: '2026-06-02 16:00', isCurrent: false },
      { id: 't2', status: '简历筛选中', description: 'HR正在查看您的简历', date: '2026-06-03 09:30', isCurrent: false },
      { id: 't3', status: '未通过', description: '很遗憾，您的简历未通过筛选', date: '2026-06-04 14:00', isCurrent: true },
    ],
  },
  {
    id: 'app5',
    userId: 'u1',
    jobId: 'j15',
    job: jobs.find(j => j.id === 'j15')!,
    company: companies.find(c => c.id === 'c2')!,
    resumeType: 'online',
    status: 'pending',
    applyDate: '2026-06-10',
    timeline: [
      { id: 't1', status: '投递成功', description: '简历已成功投递，等待HR查看', date: '2026-06-10 18:20', isCurrent: true },
    ],
  },
];

export const favoriteJobs: FavoriteJob[] = [
  {
    id: 'f1',
    userId: 'u1',
    jobId: 'j2',
    job: jobs.find(j => j.id === 'j2')!,
    company: companies.find(c => c.id === 'c1')!,
    createdAt: '2026-06-05',
  },
  {
    id: 'f2',
    userId: 'u1',
    jobId: 'j4',
    job: jobs.find(j => j.id === 'j4')!,
    company: companies.find(c => c.id === 'c2')!,
    createdAt: '2026-06-06',
  },
  {
    id: 'f3',
    userId: 'u1',
    jobId: 'j9',
    job: jobs.find(j => j.id === 'j9')!,
    company: companies.find(c => c.id === 'c6')!,
    createdAt: '2026-06-08',
  },
  {
    id: 'f4',
    userId: 'u1',
    jobId: 'j16',
    job: jobs.find(j => j.id === 'j16')!,
    company: companies.find(c => c.id === 'c1')!,
    createdAt: '2026-06-09',
  },
];

export const getApplicationsByUserId = (userId: string): Application[] => {
  return applications.filter(a => a.userId === userId);
};

export const getApplicationById = (id: string): Application | undefined => {
  return applications.find(a => a.id === id);
};

export const getFavoriteJobsByUserId = (userId: string): FavoriteJob[] => {
  return favoriteJobs.filter(f => f.userId === userId);
};
