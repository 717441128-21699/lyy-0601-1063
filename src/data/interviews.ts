import type { Interview } from '../types';

export const interviews: Interview[] = [
  {
    id: 'int1',
    applicationId: 'app1',
    userId: 'u1',
    companyId: 'c1',
    jobTitle: '高级前端工程师',
    companyName: '智汇科技有限公司',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&h=120&fit=crop',
    time: '2026-06-13 14:00',
    endTime: '2026-06-13 15:30',
    type: 'video',
    interviewer: '王经理',
    interviewerTitle: '技术总监',
    location: '线上视频面试',
    meetingLink: 'https://meeting.example.com/abc123',
    status: 'pending',
    notes: '请准备好个人介绍和项目经验，带上你的作品集链接',
    rescheduleHistory: [],
    round: 1,
  },
  {
    id: 'int2',
    applicationId: 'app3',
    userId: 'u1',
    companyId: 'c4',
    jobTitle: 'Java 高级开发工程师',
    companyName: '博思教育科技',
    companyLogo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=120&h=120&fit=crop',
    time: '2026-06-15 10:00',
    endTime: '2026-06-15 11:30',
    type: 'onsite',
    interviewer: '赵总监',
    interviewerTitle: '技术总监',
    location: '深圳市南山区科技园南区深南大道9988号 博思大厦 18层 会议室A',
    status: 'confirmed',
    notes: '请携带身份证和简历纸质版',
    rescheduleHistory: [
      {
        id: 'rs1',
        originalTime: '2026-06-12 14:00',
        newTime: '2026-06-15 10:00',
        reason: '个人事务冲突，希望改到下周一上午',
        status: 'approved',
        applyDate: '2026-06-10',
      },
    ],
    round: 3,
  },
  {
    id: 'int3',
    applicationId: 'app2',
    userId: 'u1',
    companyId: 'c2',
    jobTitle: '产品经理',
    companyName: '云帆软件股份有限公司',
    companyLogo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=120&fit=crop',
    time: '2026-06-11 16:00',
    endTime: '2026-06-11 17:00',
    type: 'phone',
    interviewer: '张总监',
    interviewerTitle: '产品总监',
    location: '电话面试',
    status: 'completed',
    notes: '初筛电话面试，约30分钟',
    rescheduleHistory: [],
    round: 1,
  },
  {
    id: 'int4',
    userId: 'u1',
    companyId: 'c6',
    applicationId: 'app4',
    jobTitle: '金融数据分析师',
    companyName: '恒信金融服务',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop',
    time: '2026-06-05 14:00',
    endTime: '2026-06-05 15:30',
    type: 'onsite',
    interviewer: '钱经理',
    interviewerTitle: '数据部主管',
    location: '南京市建邺区金融城3号楼22层',
    status: 'completed',
    notes: '',
    rescheduleHistory: [],
    round: 1,
  },
];

export const getInterviewsByUserId = (userId: string): Interview[] => {
  return interviews.filter(i => i.userId === userId);
};

export const getInterviewById = (id: string): Interview | undefined => {
  return interviews.find(i => i.id === id);
};

export const getUpcomingInterviews = (userId: string): Interview[] => {
  return interviews
    .filter(i => i.userId === userId && ['pending', 'confirmed', 'rescheduled'].includes(i.status))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};

export const getPastInterviews = (userId: string): Interview[] => {
  return interviews
    .filter(i => i.userId === userId && ['completed', 'cancelled', 'no_show'].includes(i.status))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
};
