import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  Building2,
  Clock,
  X,
  GitCompare,
  ChevronDown,
  ChevronUp,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { useStore } from '../store/useStore';

const cities = ['北京', '上海', '深圳', '广州', '杭州', '南京', '青岛'];
const experiences = ['不限', '应届生', '1-3年', '3-5年', '5-10年', '10年以上'];
const educations = ['不限', '大专', '本科', '硕士', '博士'];
const salaryRanges = [
  { label: '不限', min: undefined, max: undefined },
  { label: '5K以下', min: 0, max: 5 },
  { label: '5-10K', min: 5, max: 10 },
  { label: '10-20K', min: 10, max: 20 },
  { label: '20-40K', min: 20, max: 40 },
  { label: '40K以上', min: 40, max: undefined },
];
const companySizes = ['不限', '20人以下', '20-99人', '100-499人', '500-999人', '1000人以上'];

export const JobList = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');
  const [selectedSalary, setSelectedSalary] = useState<{ min?: number; max?: number }>({});
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['city', 'salary', 'experience', 'education', 'companySize']);

  const companies = useStore(state => state.companies);
  const filters = useStore(state => state.filters);
  const setFilters = useStore(state => state.setFilters);
  const getFilteredJobs = useStore(state => state.getFilteredJobs);
  const compareList = useStore(state => state.compareList);
  const clearCompare = useStore(state => state.clearCompare);

  const filteredJobs = useMemo(() => {
    let result = getFilteredJobs();
    
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(kw) ||
        j.tags.some(t => t.toLowerCase().includes(kw))
      );
    }
    
    if (selectedCity) {
      result = result.filter(j => j.location.city === selectedCity);
    }
    
    if (selectedExperience && selectedExperience !== '不限') {
      result = result.filter(j => j.experience === selectedExperience);
    }
    
    if (selectedEducation && selectedEducation !== '不限') {
      result = result.filter(j => j.education === selectedEducation);
    }
    
    if (selectedSalary.min !== undefined) {
      result = result.filter(j => j.salary.max >= selectedSalary.min!);
    }
    if (selectedSalary.max !== undefined) {
      result = result.filter(j => j.salary.min <= selectedSalary.max!);
    }
    
    return result;
  }, [getFilteredJobs, keyword, selectedCity, selectedExperience, selectedEducation, selectedSalary]);

  const toggleFilter = (filterName: string) => {
    setExpandedFilters(prev =>
      prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const getCompanyById = (id: string) => companies.find(c => c.id === id);

  const compareJobs = compareList.map(id => {
    const job = filteredJobs.find(j => j.id === id);
    if (!job) return null;
    const company = getCompanyById(job.companyId);
    if (!company) return null;
    return { job, company };
  }).filter(Boolean) as { job: any; company: any }[];

  const FilterSection = ({ title, name, children }: { title: string; name: string; children: React.ReactNode }) => (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => toggleFilter(name)}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-slate-700"
      >
        {title}
        {expandedFilters.includes(name) ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {expandedFilters.includes(name) && (
        <div className="pb-4">{children}</div>
      )}
    </div>
  );

  return (
    <div>
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              找到你的理想工作
            </h1>
            <p className="text-primary-100 mb-8">
              超过10,000+优质职位，让好工作找到你
            </p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索职位、公司或技能..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-base bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-primary-200">热门搜索：</span>
              {['前端工程师', '产品经理', 'Java开发', 'UI设计师', '运营'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setKeyword(tag)}
                  className="px-3 py-1 text-sm bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <button
            className="lg:hidden flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-card text-slate-700 font-medium"
            onClick={() => setShowMobileFilter(true)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            筛选条件
          </button>

          {showMobileFilter && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowMobileFilter(false)}>
              <div 
                className="absolute right-0 top-0 bottom-0 w-80 bg-white p-5 overflow-y-auto animate-slide-in-right"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">筛选条件</h3>
                  <button onClick={() => setShowMobileFilter(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <MobileFilterContent
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  selectedExperience={selectedExperience}
                  setSelectedExperience={setSelectedExperience}
                  selectedEducation={selectedEducation}
                  setSelectedEducation={setSelectedEducation}
                  selectedSalary={selectedSalary}
                  setSelectedSalary={setSelectedSalary}
                />
              </div>
            </div>
          )}

          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-5 sticky top-20">
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary-600" />
                筛选条件
              </h3>

              <FilterSection title="工作地点" name="city">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCity('')}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      !selectedCity ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    不限
                  </button>
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        selectedCity === city ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="薪资范围" name="salary">
                <div className="flex flex-wrap gap-1.5">
                  {salaryRanges.map(range => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedSalary({ min: range.min, max: range.max })}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        selectedSalary.min === range.min && selectedSalary.max === range.max
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="工作经验" name="experience">
                <div className="space-y-1">
                  {experiences.map(exp => (
                    <button
                      key={exp}
                      onClick={() => setSelectedExperience(exp === '不限' ? '' : exp)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        (exp === '不限' && !selectedExperience) || selectedExperience === exp
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="学历要求" name="education">
                <div className="space-y-1">
                  {educations.map(edu => (
                    <button
                      key={edu}
                      onClick={() => setSelectedEducation(edu === '不限' ? '' : edu)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        (edu === '不限' && !selectedEducation) || selectedEducation === edu
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {edu}
                    </button>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  职位列表
                </h2>
                <p className="text-sm text-slate-500">
                  共找到 <span className="text-primary-600 font-medium">{filteredJobs.length}</span> 个职位
                </p>
              </div>
              <div className="flex items-center gap-2">
                {compareList.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-lg">
                    <GitCompare className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-primary-700">
                      已对比 {compareList.length}/3
                    </span>
                    <button
                      onClick={clearCompare}
                      className="text-xs text-primary-500 hover:text-primary-700"
                    >
                      清空
                    </button>
                  </div>
                )}
              </div>
            </div>

            {compareJobs.length >= 2 && (
              <div className="card p-5 mb-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-primary-600" />
                  职位对比
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 text-slate-500 font-medium w-28">对比项</th>
                        {compareJobs.map(({ job, company }) => (
                          <th key={job.id} className="text-left py-2 px-3 min-w-[180px]">
                            <div className="font-medium text-slate-800">{job.title}</div>
                            <div className="text-xs text-slate-500">{company.name}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-3 text-slate-500">薪资</td>
                        {compareJobs.map(({ job }) => (
                          <td key={job.id} className="py-2.5 px-3 font-semibold text-accent-600">
                            {job.salary.min}-{job.salary.max}K
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-3 text-slate-500">地点</td>
                        {compareJobs.map(({ job }) => (
                          <td key={job.id} className="py-2.5 px-3 text-slate-700">
                            {job.location.city} · {job.location.district}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-3 text-slate-500">经验</td>
                        {compareJobs.map(({ job }) => (
                          <td key={job.id} className="py-2.5 px-3 text-slate-700">{job.experience}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-3 text-slate-500">学历</td>
                        {compareJobs.map(({ job }) => (
                          <td key={job.id} className="py-2.5 px-3 text-slate-700">{job.education}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-slate-500">公司规模</td>
                        {compareJobs.map(({ company }) => (
                          <td key={company.id} className="py-2.5 px-3 text-slate-700">{company.scale}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => {
                  const company = getCompanyById(job.companyId);
                  if (!company) return null;
                  return (
                    <JobCard
                      key={job.id}
                      job={job}
                      company={company}
                      showCompare={true}
                    />
                  );
                })
              ) : (
                <div className="card p-12 text-center">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">暂无符合条件的职位</p>
                  <p className="text-sm text-slate-400 mt-1">试试调整筛选条件吧</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileFilterContent = ({
  selectedCity, setSelectedCity,
  selectedExperience, setSelectedExperience,
  selectedEducation, setSelectedEducation,
  selectedSalary, setSelectedSalary,
}: any) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-2">工作地点</h4>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCity('')}
          className={`px-3 py-1.5 text-xs rounded-lg ${!selectedCity ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}`}
        >
          不限
        </button>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-3 py-1.5 text-xs rounded-lg ${selectedCity === city ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-2">薪资范围</h4>
      <div className="flex flex-wrap gap-1.5">
        {salaryRanges.map(range => (
          <button
            key={range.label}
            onClick={() => setSelectedSalary({ min: range.min, max: range.max })}
            className={`px-3 py-1.5 text-xs rounded-lg ${
              selectedSalary.min === range.min && selectedSalary.max === range.max
                ? 'bg-primary-100 text-primary-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-2">工作经验</h4>
      <div className="space-y-1">
        {experiences.map(exp => (
          <button
            key={exp}
            onClick={() => setSelectedExperience(exp === '不限' ? '' : exp)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
              (exp === '不限' && !selectedExperience) || selectedExperience === exp
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600'
            }`}
          >
            {exp}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-2">学历要求</h4>
      <div className="space-y-1">
        {educations.map(edu => (
          <button
            key={edu}
            onClick={() => setSelectedEducation(edu === '不限' ? '' : edu)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
              (edu === '不限' && !selectedEducation) || selectedEducation === edu
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600'
            }`}
          >
            {edu}
          </button>
        ))}
      </div>
    </div>
  </div>
);
