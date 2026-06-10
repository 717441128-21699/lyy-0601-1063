import { useState, useRef } from 'react';
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
  Check,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Resume, EducationItem, ExperienceItem, ProjectItem, AttachmentItem } from '../types';

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
  const resume = useStore((state) => state.resume);
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
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  {(() => {
                    const section = sections.find((s) => s.id === activeSection);
                    if (section) {
                      const Icon = section.icon;
                      return (
                        <>
                          <Icon className="w-6 h-6 text-primary-600" />
                          {section.label}
                        </>
                      );
                    }
                    return null;
                  })()}
                </h2>
                {activeSection !== 'privacy' && activeSection !== 'attachments' && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-1.5" />
                        取消编辑
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-1.5" />
                        编辑
                      </>
                    )}
                  </button>
                )}
              </div>

              {activeSection === 'basic' && (
                <BasicInfoSection isEditing={isEditing} />
              )}
              {activeSection === 'intention' && (
                <JobIntentionSection isEditing={isEditing} />
              )}
              {activeSection === 'education' && (
                <EducationSection isEditing={isEditing} />
              )}
              {activeSection === 'experience' && (
                <ExperienceSection isEditing={isEditing} />
              )}
              {activeSection === 'projects' && (
                <ProjectsSection isEditing={isEditing} />
              )}
              {activeSection === 'skills' && (
                <SkillsSection isEditing={isEditing} />
              )}
              {activeSection === 'intro' && (
                <IntroSection isEditing={isEditing} />
              )}
              {activeSection === 'attachments' && (
                <AttachmentsSection />
              )}
              {activeSection === 'privacy' && (
                <PrivacySection />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BasicInfoSection = ({ isEditing }: { isEditing: boolean }) => {
  const resume = useStore((state) => state.resume);
  const updateResumeBasicInfo = useStore((state) => state.updateResumeBasicInfo);
  const [formData, setFormData] = useState(resume.basicInfo);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateResumeBasicInfo(formData);
  };

  const displayData = isEditing ? formData : resume.basicInfo;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-6 pb-5 border-b border-slate-100">
        <img
          src={displayData.avatar}
          alt={displayData.name}
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
        <InfoItem
          label="姓名"
          value={displayData.name}
          isEditing={isEditing}
          onChange={(v) => handleChange('name', v)}
        />
        <InfoItem
          label="性别"
          value={displayData.gender}
          isEditing={isEditing}
          onChange={(v) => handleChange('gender', v)}
        />
        <InfoItem
          label="年龄"
          value={`${displayData.age}岁`}
          isEditing={isEditing}
          onChange={(v) => handleChange('age', parseInt(v) || 0)}
        />
        <InfoItem
          label="工作年限"
          value={`${displayData.workYears}年`}
          isEditing={isEditing}
          onChange={(v) => handleChange('workYears', parseInt(v) || 0)}
        />
        <InfoItem
          label="手机号"
          value={displayData.phone}
          isEditing={isEditing}
          onChange={(v) => handleChange('phone', v)}
        />
        <InfoItem
          label="邮箱"
          value={displayData.email}
          isEditing={isEditing}
          onChange={(v) => handleChange('email', v)}
        />
        <InfoItem
          label="所在城市"
          value={displayData.location}
          isEditing={isEditing}
          onChange={(v) => handleChange('location', v)}
        />
        <InfoItem
          label="求职状态"
          value={displayData.jobStatus}
          isEditing={isEditing}
          onChange={(v) => handleChange('jobStatus', v)}
        />
      </div>

      {isEditing && (
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button onClick={handleSave} className="btn btn-primary">
            <Save className="w-4 h-4 mr-1.5" />
            保存修改
          </button>
        </div>
      )}
    </div>
  );
};

const JobIntentionSection = ({ isEditing }: { isEditing: boolean }) => {
  const resume = useStore((state) => state.resume);
  const updateJobIntention = useStore((state) => state.updateJobIntention);
  const [formData, setFormData] = useState(resume.jobIntention);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateJobIntention(formData);
  };

  const displayData = isEditing ? formData : resume.jobIntention;

  return (
    <div className="space-y-5">
      <InfoItem
        label="期望职位"
        value={displayData.position}
        isEditing={isEditing}
        onChange={(v) => handleChange('position', v)}
      />
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="text-sm text-slate-500 mb-1.5 block">期望薪资</label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => handleChange('salaryMin', parseInt(e.target.value) || 0)}
                className="input"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => handleChange('salaryMax', parseInt(e.target.value) || 0)}
                className="input"
              />
              <span className="text-slate-500">K</span>
            </div>
          ) : (
            <p className="text-slate-800 font-medium">
              {displayData.salaryMin}-{displayData.salaryMax}K
            </p>
          )}
        </div>
        <InfoItem
          label="期望城市"
          value={displayData.city}
          isEditing={isEditing}
          onChange={(v) => handleChange('city', v)}
        />
      </div>
      <InfoItem
        label="求职状态"
        value={displayData.status}
        isEditing={isEditing}
        onChange={(v) => handleChange('status', v)}
      />

      {isEditing && (
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button onClick={handleSave} className="btn btn-primary">
            <Save className="w-4 h-4 mr-1.5" />
            保存修改
          </button>
        </div>
      )}
    </div>
  );
};

const EducationSection = ({ isEditing }: { isEditing: boolean }) => {
  const resume = useStore((state) => state.resume);
  const addEducation = useStore((state) => state.addEducation);
  const deleteEducation = useStore((state) => state.deleteEducation);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState({
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleAdd = () => {
    if (newEducation.school && newEducation.major) {
      addEducation(newEducation);
      setNewEducation({
        school: '',
        major: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      {resume.education.map((edu: EducationItem, index: number) => (
        <div key={edu.id} className="relative pl-6 pb-6 last:pb-0">
          {index < resume.education.length - 1 && (
            <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-slate-200" />
          )}
          <div className="absolute left-0 top-1 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow" />
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">{edu.school}</h4>
              <p className="text-sm text-slate-500 mt-1">
                {edu.major} · {edu.degree}
              </p>
              {edu.description && (
                <p className="text-sm text-slate-600 mt-2">{edu.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-slate-400">
                {edu.startDate} - {edu.endDate}
              </span>
              {isEditing && (
                <button
                  onClick={() => deleteEducation(edu.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {isEditing && (
        <div className="p-4 bg-slate-50 rounded-xl space-y-4">
          <h4 className="font-medium text-slate-800">添加教育经历</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="学校名称"
              value={newEducation.school}
              onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
              className="input text-sm"
            />
            <input
              type="text"
              placeholder="专业"
              value={newEducation.major}
              onChange={(e) => setNewEducation({ ...newEducation, major: e.target.value })}
              className="input text-sm"
            />
            <input
              type="text"
              placeholder="学历"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              className="input text-sm"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="开始时间"
                value={newEducation.startDate}
                onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                className="input text-sm"
              />
              <input
                type="text"
                placeholder="结束时间"
                value={newEducation.endDate}
                onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                className="input text-sm"
              />
            </div>
          </div>
          <textarea
            placeholder="描述（选填）"
            value={newEducation.description}
            onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
            className="input text-sm h-20 resize-none"
          />
          <button onClick={handleAdd} className="btn btn-primary btn-sm w-full">
            <Plus className="w-4 h-4 mr-1.5" />
            添加
          </button>
        </div>
      )}
    </div>
  );
};

const ExperienceSection = ({ isEditing }: { isEditing: boolean }) => {
  const resume = useStore((state) => state.resume);
  const addExperience = useStore((state) => state.addExperience);
  const deleteExperience = useStore((state) => state.deleteExperience);
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: [] as string[],
  });

  const handleAdd = () => {
    if (newExperience.company && newExperience.position) {
      addExperience(newExperience);
      setNewExperience({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        achievements: [],
      });
    }
  };

  return (
    <div className="space-y-6">
      {resume.experience.map((exp: ExperienceItem, index: number) => (
        <div key={exp.id} className="relative pl-6 pb-6 last:pb-0">
          {index < resume.experience.length - 1 && (
            <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-slate-200" />
          )}
          <div className="absolute left-0 top-1 w-4 h-4 bg-accent-500 rounded-full border-4 border-white shadow" />
          <div className="flex items-start justify-between">
            <div className="flex-1">
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
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <span className="text-sm text-slate-400">
                {exp.startDate} - {exp.isCurrent ? '至今' : exp.endDate}
              </span>
              {isEditing && (
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {isEditing && (
        <div className="p-4 bg-slate-50 rounded-xl space-y-4">
          <h4 className="font-medium text-slate-800">添加工作经历</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="公司名称"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="input text-sm"
            />
            <input
              type="text"
              placeholder="职位"
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              className="input text-sm"
            />
            <input
              type="text"
              placeholder="开始时间"
              value={newExperience.startDate}
              onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
              className="input text-sm"
            />
            <input
              type="text"
              placeholder="结束时间"
              value={newExperience.endDate}
              onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
              className="input text-sm"
              disabled={newExperience.isCurrent}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={newExperience.isCurrent}
              onChange={(e) => setNewExperience({ ...newExperience, isCurrent: e.target.checked })}
            />
            我目前在这家公司工作
          </label>
          <textarea
            placeholder="工作描述"
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
            className="input text-sm h-20 resize-none"
          />
          <button onClick={handleAdd} className="btn btn-primary btn-sm w-full">
            <Plus className="w-4 h-4 mr-1.5" />
            添加
          </button>
        </div>
      )}
    </div>
  );
};

const ProjectsSection = ({ isEditing }: { isEditing: boolean }) => {
  const resume = useStore((state) => state.resume);
  const addProject = useStore((state) => state.addProject);
  const deleteProject = useStore((state) => state.deleteProject);
  const [newProject, setNewProject] = useState({
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: [] as string[],
  });
  const [techInput, setTechInput] = useState('');

  const handleAddTech = () => {
    if (techInput.trim() && !newProject.technologies.includes(techInput.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter((t) => t !== tech),
    });
  };

  const handleAdd = () => {
    if (newProject.name && newProject.role) {
      addProject(newProject);
      setNewProject({
        name: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        technologies: [],
      });
    }
  };

  return (
    <div className="space-y-5">
      {resume.projects.map((project: ProjectItem) => (
        <div key={project.id} className="p-4 bg-slate-50 rounded-xl">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-slate-800">{project.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                {project.startDate} - {project.endDate}
              </span>
              {isEditing && (
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
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
        <div className="p-4 bg-slate-50 rounded-xl space-y-4">
          <h4 className="font-medium text-slate-800">添加项目经验</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="项目名称"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="input text-sm"
            />
            <input
              type="text"
              placeholder="担任角色"
              value={newProject.role}
              onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
              className="input text-sm"
            />
            <input
              type="text"
              placeholder="开始时间"
              value={newProject.startDate}
              onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
              className="input text-sm"
            />
            <input
              type="text"
              placeholder="结束时间"
              value={newProject.endDate}
              onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
              className="input text-sm"
            />
          </div>
          <textarea
            placeholder="项目描述"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="input text-sm h-20 resize-none"
          />
          <div>
            <label className="text-sm text-slate-500 mb-1.5 block">技术栈</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {newProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs"
                >
                  {tech}
                  <button
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="输入技术名称"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="input text-sm flex-1"
              />
              <button onClick={handleAddTech} className="btn btn-secondary btn-sm">
                添加
              </button>
            </div>
          </div>
          <button onClick={handleAdd} className="btn btn-primary btn-sm w-full">
            <Plus className="w-4 h-4 mr-1.5" />
            添加项目
          </button>
        </div>
      )}
    </div>
  );
};

const SkillsSection = ({ isEditing }: { isEditing: boolean }) => {
  const resume = useStore((state) => state.resume);
  const addSkill = useStore((state) => state.addSkill);
  const removeSkill = useStore((state) => state.removeSkill);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      addSkill(skillInput.trim());
      setSkillInput('');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {resume.skills.map((skill: string) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => removeSkill(skill)}
                className="hover:text-primary-900"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
      </div>
      {isEditing && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="输入技能名称"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            className="input flex-1"
          />
          <button onClick={handleAddSkill} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-1.5" />
            添加
          </button>
        </div>
      )}
    </div>
  );
};

const IntroSection = ({ isEditing }: { isEditing: boolean }) => {
  const resume = useStore((state) => state.resume);
  const updateSelfIntroduction = useStore((state) => state.updateSelfIntroduction);
  const [text, setText] = useState(resume.selfIntroduction);

  const handleSave = () => {
    updateSelfIntroduction(text);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input h-32 resize-none"
            placeholder="介绍一下自己吧..."
          />
          <div className="flex justify-end mt-4">
            <button onClick={handleSave} className="btn btn-primary">
              <Save className="w-4 h-4 mr-1.5" />
              保存
            </button>
          </div>
        </>
      ) : (
        <p className="text-slate-600 leading-relaxed">
          {resume.selfIntroduction || '暂无自我评价，点击编辑添加'}
        </p>
      )}
    </div>
  );
};

const AttachmentsSection = () => {
  const resume = useStore((state) => state.resume);
  const addAttachment = useStore((state) => state.addAttachment);
  const deleteAttachment = useStore((state) => state.deleteAttachment);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSize = (file.size / 1024 / 1024).toFixed(2) + 'MB';
      const fileType = file.name.split('.').pop()?.toLowerCase() || '';
      
      addAttachment({
        name: file.name,
        size: fileSize,
        type: fileType,
        uploadDate: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file),
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个附件吗？')) {
      deleteAttachment(id);
    }
  };

  const handleDownload = (attachment: AttachmentItem) => {
    if (attachment.url && attachment.url.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('下载功能 - 实际项目中会下载文件');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 mb-4">
        上传你的附件简历，方便HR下载查看。支持PDF、DOC格式，单个文件不超过10MB。
      </p>
      {resume.attachments.length > 0 ? (
        <div className="space-y-3">
          {resume.attachments.map((file: AttachmentItem) => (
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
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="下载"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
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
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="btn btn-secondary w-full"
      >
        <Upload className="w-4 h-4 mr-1.5" />
        上传附件简历
      </button>
    </div>
  );
};

const PrivacySection = () => {
  const resume = useStore((state) => state.resume);
  const setVisibility = useStore((state) => state.setVisibility);

  const visibilityOptions = [
    { value: 'public' as const, label: '公开', icon: Globe, description: '所有企业都可以搜索并查看你的简历' },
    { value: 'applied' as const, label: '仅投递企业可见', icon: Building2, description: '只有你主动投递过的企业可以查看' },
    { value: 'private' as const, label: '完全隐藏', icon: Lock, description: '所有企业都无法查看你的简历' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 mb-4">
        设置简历的可见范围，保护你的隐私
      </p>
      <div className="space-y-3">
        {visibilityOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = resume.visibility === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setVisibility(option.value)}
              className={`w-full flex items-start gap-3 p-4 border-2 rounded-xl text-left transition-all ${
                isSelected
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mt-0.5">
                {isSelected ? (
                  <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className="font-medium text-slate-800">{option.label}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1 ml-6">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const InfoItem = ({
  label,
  value,
  isEditing,
  onChange,
}: {
  label: string;
  value: string | number;
  isEditing: boolean;
  onChange?: (value: string) => void;
}) => (
  <div>
    <label className="text-sm text-slate-500 mb-1.5 block">{label}</label>
    {isEditing ? (
      <input
        type="text"
        value={String(value)}
        onChange={(e) => onChange?.(e.target.value)}
        className="input"
      />
    ) : (
      <p className="text-slate-800 font-medium">{value || '未填写'}</p>
    )}
  </div>
);
