import { useState } from 'react';
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  Paperclip,
  Eye,
  EyeOff,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  ChevronRight,
  Upload,
  Download,
  Globe,
  Lock,
  Building2,
  Target,
} from 'lucide-react';
import { useStore } from '../store/useStore';

const sections = [
  { id: 'basic', label: '基本信息', icon: User },
  { id: 'intention', label: '求职意向', icon: Target },
  { id: 'education', label: '教育经历', icon: GraduationCap },
  { id: 'experience', label: '工作经历', icon: Briefcase },
  { id: 'projects', label: '项目经验', icon: FolderKanban },
  { id: 'skills', label: '技能特长', icon: Award },
  { id: 'intro', label: '自我评价', icon: FileText },
  { id: 'attachments', label: '附件简历', icon: Paperclip },
  { id: 'privacy', label: '隐私设置', icon: Lock },
];

export const ResumeCenter = () => {
  const resume = useStore(state => state.resume);
  const [activeSection, setActiveSection] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);

  const visibilityOptions = [
    { value: 'public', label: '公开', icon: Globe, description: '所有企业都可以查看你的简历' },
    { value: 'applied', label: '仅投递企业', icon: Building2, description: '只有你投递过的企业可以查看' },
    { value: 'private', label: '隐藏', icon: EyeOff, description: '所有企业都无法查看' },
  ];

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="card p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={resume.basicInfo.avatar}
                  alt={resume.basicInfo.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-slate-800">{resume.basicInfo.name}</h3>
                  <p className="text-sm text-slate-500">{resume.basicInfo.jobStatus}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-600">简历完整度</span>
                  <span className="font-medium text-primary-600">{resume.completeness}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${resume.completeness}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card p-3">
              <nav className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  {sections.find(s => s.id === activeSection)?.icon && 
                    (() => {
                      const Icon = sections.find(s => s.id === activeSection)!.icon;
                      return <Icon className="w-6 h-6 text-primary-600" />;
                    })()}
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-1.5" />
                      取消
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-1.5" />
                      编辑
                    </>
                  )}
                </button>
              </div>

              {activeSection === 'basic' && (
                <BasicInfoSection resume={resume} isEditing={isEditing} />
              )}
              {activeSection === 'intention' && (
                <JobIntentionSection resume={resume} isEditing={isEditing} />
              )}
              {activeSection === 'education' && (
                <EducationSection resume={resume} isEditing={isEditing} />
              )}
              {activeSection === 'experience' && (
                <ExperienceSection resume={resume} isEditing={isEditing} />
              )}
              {activeSection === 'projects' && (
                <ProjectsSection resume={resume} isEditing={isEditing} />
              )}
              {activeSection === 'skills' && (
                <SkillsSection resume={resume} isEditing={isEditing} />
              )}
              {activeSection === 'intro' && (
                <IntroSection resume={resume} isEditing={isEditing} />
              )}
              {activeSection === 'attachments' && (
                <AttachmentsSection resume={resume} />
              )}
              {activeSection === 'privacy' && (
                <PrivacySection resume={resume} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BasicInfoSection = ({ resume, isEditing }: { resume: any; isEditing: boolean }) => (
  <div className="space-y-5">
    <div className="flex items-center gap-6 pb-5 border-b border-slate-100">
      <img
        src={resume.basicInfo.avatar}
        alt={resume.basicInfo.name}
        className="w-24 h-24 rounded-xl object-cover"
      />
      {isEditing && (
        <button className="btn btn-secondary">
          <Upload className="w-4 h-4 mr-1.5" />
          更换头像
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <InfoItem label="姓名" value={resume.basicInfo.name} isEditing={isEditing} />
      <InfoItem label="性别" value={resume.basicInfo.gender} isEditing={isEditing} />
      <InfoItem label="年龄" value={`${resume.basicInfo.age}岁`} isEditing={isEditing} />
      <InfoItem label="工作年限" value={`${resume.basicInfo.workYears}年`} isEditing={isEditing} />
      <InfoItem label="手机号" value={resume.basicInfo.phone} isEditing={isEditing} />
      <InfoItem label="邮箱" value={resume.basicInfo.email} isEditing={isEditing} />
      <InfoItem label="所在城市" value={resume.basicInfo.location} isEditing={isEditing} />
      <InfoItem label="求职状态" value={resume.basicInfo.jobStatus} isEditing={isEditing} />
    </div>
  </div>
);

const JobIntentionSection = ({ resume, isEditing }: { resume: any; isEditing: boolean }) => (
  <div className="space-y-5">
    <InfoItem label="期望职位" value={resume.jobIntention.position} isEditing={isEditing} />
    <div className="grid grid-cols-2 gap-5">
      <InfoItem
        label="期望薪资"
        value={`${resume.jobIntention.salaryMin}-${resume.jobIntention.salaryMax}K`}
        isEditing={isEditing}
      />
      <InfoItem label="期望城市" value={resume.jobIntention.city} isEditing={isEditing} />
    </div>
    <InfoItem label="求职状态" value={resume.jobIntention.status} isEditing={isEditing} />
  </div>
);

const EducationSection = ({ resume, isEditing }: { resume: any; isEditing: boolean }) => (
  <div className="space-y-6">
    {resume.education.map((edu: any, index: number) => (
      <div key={edu.id} className="relative pl-6 pb-6 last:pb-0">
        {index < resume.education.length - 1 && (
          <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-slate-200" />
        )}
        <div className="absolute left-0 top-1 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow" />
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-800">{edu.school}</h4>
            <p className="text-sm text-slate-500 mt-1">
              {edu.major} · {edu.degree}
            </p>
            {edu.description && (
              <p className="text-sm text-slate-600 mt-2">{edu.description}</p>
            )}
          </div>
          <span className="text-sm text-slate-400 flex-shrink-0">
            {edu.startDate} - {edu.endDate}
          </span>
        </div>
      </div>
    ))}
    {isEditing && (
      <button className="btn btn-secondary w-full">
        <Plus className="w-4 h-4 mr-1.5" />
        添加教育经历
      </button>
    )}
  </div>
);

const ExperienceSection = ({ resume, isEditing }: { resume: any; isEditing: boolean }) => (
  <div className="space-y-6">
    {resume.experience.map((exp: any, index: number) => (
      <div key={exp.id} className="relative pl-6 pb-6 last:pb-0">
        {index < resume.experience.length - 1 && (
          <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-slate-200" />
        )}
        <div className="absolute left-0 top-1 w-4 h-4 bg-accent-500 rounded-full border-4 border-white shadow" />
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-800">{exp.company}</h4>
            <p className="text-sm text-primary-600 mt-0.5 font-medium">{exp.position}</p>
            <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="mt-3 space-y-1">
                {exp.achievements.map((achievement: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="text-sm text-slate-400 flex-shrink-0 ml-4">
            {exp.startDate} - {exp.isCurrent ? '至今' : exp.endDate}
          </span>
        </div>
      </div>
    ))}
    {isEditing && (
      <button className="btn btn-secondary w-full">
        <Plus className="w-4 h-4 mr-1.5" />
        添加工作经历
      </button>
    )}
  </div>
);

const ProjectsSection = ({ resume, isEditing }: { resume: any; isEditing: boolean }) => (
  <div className="space-y-5">
    {resume.projects.map((project: any) => (
      <div key={project.id} className="p-4 bg-slate-50 rounded-xl">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-slate-800">{project.name}</h4>
          <span className="text-sm text-slate-400">
            {project.startDate} - {project.endDate}
          </span>
        </div>
        <p className="text-sm text-primary-600 mb-2">{project.role}</p>
        <p className="text-sm text-slate-600 mb-3">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech: string) => (
            <span key={tech} className="badge badge-slate">
              {tech}
            </span>
          ))}
        </div>
      </div>
    ))}
    {isEditing && (
      <button className="btn btn-secondary w-full">
        <Plus className="w-4 h-4 mr-1.5" />
        添加项目经验
      </button>
    )}
  </div>
);

const SkillsSection = ({ resume, isEditing }: { resume: any; isEditing: boolean }) => (
  <div>
    <div className="flex flex-wrap gap-2">
      {resume.skills.map((skill: string) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm"
        >
          {skill}
          {isEditing && <X className="w-3 h-3 cursor-pointer hover:text-primary-900" />}
        </span>
      ))}
      {isEditing && (
        <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 rounded-lg text-sm hover:border-primary-300 hover:text-primary-600 transition-colors">
          <Plus className="w-4 h-4" />
          添加技能
        </button>
      )}
    </div>
  </div>
);

const IntroSection = ({ resume, isEditing }: { resume: any; isEditing: boolean }) => (
  <div>
    {isEditing ? (
      <textarea
        defaultValue={resume.selfIntroduction}
        className="input h-32 resize-none"
        placeholder="介绍一下自己吧..."
      />
    ) : (
      <p className="text-slate-600 leading-relaxed">
        {resume.selfIntroduction || '暂无自我评价，点击编辑添加'}
      </p>
    )}
  </div>
);

const AttachmentsSection = ({ resume }: { resume: any }) => (
  <div className="space-y-4">
    <p className="text-sm text-slate-500 mb-4">
      上传你的附件简历，方便HR下载查看。支持PDF、DOC格式，单个文件不超过10MB。
    </p>
    {resume.attachments.length > 0 ? (
      <div className="space-y-3">
        {resume.attachments.map((file: any) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Paperclip className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {file.size} · {file.uploadDate}上传
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
        <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">暂无附件简历</p>
      </div>
    )}
    <button className="btn btn-secondary w-full">
      <Upload className="w-4 h-4 mr-1.5" />
      上传附件简历
    </button>
  </div>
);

const PrivacySection = ({ resume }: { resume: any }) => {
  const visibilityOptions = [
    { value: 'public', label: '公开', icon: Globe, description: '所有企业都可以搜索并查看你的简历' },
    { value: 'applied', label: '仅投递企业可见', icon: Building2, description: '只有你主动投递过的企业可以查看' },
    { value: 'private', label: '完全隐藏', icon: Lock, description: '所有企业都无法查看你的简历' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 mb-4">
        设置简历的可见范围，保护你的隐私
      </p>
      <div className="space-y-3">
        {visibilityOptions.map(option => {
          const Icon = option.icon;
          const isSelected = resume.visibility === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                checked={isSelected}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className="font-medium text-slate-800">{option.label}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1 ml-6">{option.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, isEditing }: { label: string; value: string; isEditing: boolean }) => (
  <div>
    <label className="text-sm text-slate-500 mb-1.5 block">{label}</label>
    {isEditing ? (
      <input type="text" defaultValue={value} className="input" />
    ) : (
      <p className="text-slate-800 font-medium">{value || '未填写'}</p>
    )}
  </div>
);
