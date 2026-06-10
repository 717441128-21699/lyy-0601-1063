import type { Message, ChatConversation, Report, AdminStats } from '../types';

export const messages: Message[] = [
  {
    id: 'm1',
    type: 'interview',
    senderId: 'sys',
    senderName: '智汇科技',
    senderAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&h=120&fit=crop',
    receiverId: 'u1',
    title: '面试邀请',
    content: '您好！您投递的「高级前端工程师」职位，HR已发起面试邀请，请尽快确认。',
    isRead: false,
    createdAt: '2026-06-10 16:40',
    relatedId: 'int1',
    relatedType: 'interview',
  },
  {
    id: 'm2',
    type: 'application',
    senderId: 'sys',
    senderName: '系统通知',
    senderAvatar: '',
    receiverId: 'u1',
    title: '简历已查看',
    content: '您投递的「产品经理」职位，HR已查看您的简历。',
    isRead: true,
    createdAt: '2026-06-09 15:30',
    relatedId: 'app2',
    relatedType: 'application',
  },
  {
    id: 'm3',
    type: 'system',
    senderId: 'sys',
    senderName: '系统通知',
    senderAvatar: '',
    receiverId: 'u1',
    title: '恭喜获得Offer',
    content: '恭喜您通过了「Java 高级开发工程师」职位的全部面试，HR将在1个工作日内发送正式Offer。',
    isRead: false,
    createdAt: '2026-06-09 11:00',
    relatedId: 'app3',
    relatedType: 'application',
  },
  {
    id: 'm4',
    type: 'interview',
    senderId: 'sys',
    senderName: '博思教育',
    senderAvatar: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=120&h=120&fit=crop',
    receiverId: 'u1',
    title: '面试改约已确认',
    content: '您申请的面试改约已通过，新的面试时间为6月15日 10:00，请准时参加。',
    isRead: true,
    createdAt: '2026-06-10 09:20',
    relatedId: 'int2',
    relatedType: 'interview',
  },
  {
    id: 'm5',
    type: 'application',
    senderId: 'sys',
    senderName: '系统通知',
    senderAvatar: '',
    receiverId: 'u1',
    title: '简历未通过',
    content: '很遗憾，您投递的「算法工程师」职位简历未通过筛选，继续加油！',
    isRead: true,
    createdAt: '2026-06-04 14:00',
    relatedId: 'app4',
    relatedType: 'application',
  },
  {
    id: 'm6',
    type: 'chat',
    senderId: 'hr1',
    senderName: '王经理',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    receiverId: 'u1',
    title: '',
    content: '您好，请问您方便下周二下午有时间参加面试吗？',
    isRead: false,
    createdAt: '2026-06-10 17:30',
  },
];

export const chatConversations: ChatConversation[] = [
  {
    id: 'chat1',
    participantId: 'hr1',
    participantName: '王经理',
    participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    participantType: 'hr',
    lastMessage: '您好，请问您方便下周二下午有时间参加面试吗？',
    lastMessageTime: '2026-06-10 17:30',
    unreadCount: 1,
    jobTitle: '高级前端工程师',
  },
  {
    id: 'chat2',
    participantId: 'hr2',
    participantName: '张总监',
    participantAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop',
    participantType: 'hr',
    lastMessage: '好的，期待您的回复',
    lastMessageTime: '2026-06-08 14:20',
    unreadCount: 0,
    jobTitle: '产品经理',
  },
  {
    id: 'chat3',
    participantId: 'hr3',
    participantName: '赵总监',
    participantAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f77c0b?w=120&h=120&fit=crop',
    participantType: 'hr',
    lastMessage: 'Offer已经发送到您邮箱了，请注意查收',
    lastMessageTime: '2026-06-09 11:30',
    unreadCount: 0,
    jobTitle: 'Java 高级开发工程师',
  },
];

export const reports: Report[] = [
  {
    id: 'rpt1',
    type: 'job',
    targetId: 'j5',
    targetName: '电商运营专员',
    reporterId: 'u2',
    reporterName: '张某某',
    reason: '虚假招聘',
    description: '该职位薪资与实际不符，涉嫌虚假宣传',
    status: 'pending',
    createdAt: '2026-06-10 10:30',
  },
  {
    id: 'rpt2',
    type: 'company',
    targetId: 'c3',
    targetName: '星辰电商有限公司',
    reporterId: 'u3',
    reporterName: '李某某',
    reason: '公司信息不实',
    description: '公司规模描述与实际不符，涉嫌欺诈',
    status: 'processing',
    createdAt: '2026-06-09 15:00',
    handledAt: '2026-06-10 09:00',
  },
  {
    id: 'rpt3',
    type: 'job',
    targetId: 'j10',
    targetName: '理财顾问',
    reporterId: 'u4',
    reporterName: '王某某',
    reason: '疑似传销/诈骗',
    description: '要求先交培训费，怀疑是诈骗',
    status: 'resolved',
    createdAt: '2026-06-08 11:20',
    handledAt: '2026-06-09 16:00',
  },
];

export const adminStats: AdminStats = {
  totalCompanies: 156,
  pendingCompanies: 12,
  totalJobs: 428,
  pendingJobs: 35,
  totalUsers: 12580,
  totalReports: 47,
  pendingReports: 8,
  todayApplications: 256,
  weeklyTrend: [
    { date: '06-05', applications: 198, jobs: 12 },
    { date: '06-06', applications: 245, jobs: 18 },
    { date: '06-07', applications: 312, jobs: 24 },
    { date: '06-08', applications: 278, jobs: 20 },
    { date: '06-09', applications: 234, jobs: 15 },
    { date: '06-10', applications: 289, jobs: 22 },
    { date: '06-11', applications: 256, jobs: 17 },
  ],
};

export const getMessagesByUserId = (userId: string): Message[] => {
  return messages.filter(m => m.receiverId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getUnreadCount = (userId: string): number => {
  return messages.filter(m => m.receiverId === userId && !m.isRead).length;
};

export const getChatConversations = (): ChatConversation[] => {
  return chatConversations;
};

export const getReports = (): Report[] => {
  return reports;
};

export const getAdminStats = (): AdminStats => {
  return adminStats;
};
