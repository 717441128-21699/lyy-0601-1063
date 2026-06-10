import type { Resume } from '../types';

export const defaultResume: Resume = {
  id: 'r1',
  userId: 'u1',
  basicInfo: {
    name: '李明远',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    gender: '男',
    age: 28,
    phone: '138****8888',
    email: 'limingyuan@email.com',
    location: '北京市海淀区',
    workYears: 5,
    jobStatus: '在职，考虑机会',
  },
  jobIntention: {
    position: '高级前端工程师',
    salaryMin: 25,
    salaryMax: 40,
    city: '北京',
    status: '在职，考虑机会',
  },
  education: [
    {
      id: 'e1',
      school: '北京理工大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2015-09',
      endDate: '2019-06',
      description: 'GPA 3.8/4.0，获得校级奖学金，计算机二级证书',
    },
    {
      id: 'e2',
      school: '清华大学',
      major: '软件工程',
      degree: '硕士',
      startDate: '2019-09',
      endDate: '2021-06',
      description: '研究方向：前端工程化与性能优化',
    },
  ],
  experience: [
    {
      id: 'exp1',
      company: '某知名互联网公司',
      position: '高级前端工程师',
      startDate: '2021-07',
      endDate: '',
      isCurrent: true,
      description: '负责公司核心产品的前端架构设计和开发，带领3人小组完成多个重要项目。',
      achievements: [
        '主导前端架构升级，页面加载性能提升40%',
        '设计并实现组件库，提升团队开发效率30%',
        '建立前端监控体系，线上问题发现率提升60%',
      ],
    },
    {
      id: 'exp2',
      company: '某创业公司',
      position: '前端开发工程师',
      startDate: '2019-06',
      endDate: '2021-06',
      isCurrent: false,
      description: '从0到1参与公司产品的前端开发工作，负责多个核心模块。',
      achievements: [
        '独立完成后台管理系统前端开发',
        '优化首屏加载时间，从3.5s降至1.2s',
        '推动团队代码规范化，代码质量显著提升',
      ],
    },
  ],
  projects: [
    {
      id: 'p1',
      name: '企业级SaaS管理平台',
      role: '前端技术负责人',
      startDate: '2022-03',
      endDate: '2023-06',
      description: '面向中小企业的一站式管理平台，涵盖人力资源、财务、客户管理等模块。',
      technologies: ['React', 'TypeScript', 'Ant Design', '微前端'],
    },
    {
      id: 'p2',
      name: '数据可视化大屏系统',
      role: '前端开发',
      startDate: '2021-09',
      endDate: '2022-02',
      description: '为运营团队打造的数据可视化大屏，实时展示业务核心指标。',
      technologies: ['Vue3', 'ECharts', 'WebSocket'],
    },
  ],
  skills: ['React', 'TypeScript', 'Vue', 'Node.js', 'Webpack', 'Vite', '性能优化', '微前端', '单元测试'],
  selfIntroduction: '5年前端开发经验，熟悉React/Vue生态，有大型项目架构经验。关注前端性能优化和工程化，热爱技术分享。性格开朗，善于沟通，有良好的团队协作能力。',
  attachments: [
    {
      id: 'a1',
      name: '李明远-前端工程师-简历.pdf',
      size: '2.5MB',
      type: 'pdf',
      uploadDate: '2026-05-20',
      url: '#',
    },
  ],
  completeness: 92,
  visibility: 'applied',
};

export const calculateCompleteness = (resume: Resume): number => {
  let score = 0;
  const total = 100;

  if (resume.basicInfo.name) score += 10;
  if (resume.basicInfo.phone) score += 5;
  if (resume.basicInfo.email) score += 5;
  if (resume.basicInfo.avatar) score += 5;

  if (resume.jobIntention.position) score += 10;
  if (resume.jobIntention.salaryMin && resume.jobIntention.salaryMax) score += 5;
  if (resume.jobIntention.city) score += 5;

  if (resume.education.length > 0) {
    score += Math.min(resume.education.length * 10, 15);
  }

  if (resume.experience.length > 0) {
    score += Math.min(resume.experience.length * 15, 25);
  }

  if (resume.projects.length > 0) {
    score += Math.min(resume.projects.length * 5, 10);
  }

  if (resume.skills.length > 0) score += 5;
  if (resume.selfIntroduction) score += 5;

  return Math.min(score, total);
};
