import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Users,
  CheckCircle,
  Globe,
  Building2,
  Image,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Clock,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { JobCard } from '../components/JobCard';

export const CompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('jobs');
  const [photoIndex, setPhotoIndex] = useState(0);

  const company = useStore(state => state.getCompanyById(id || ''));
  const jobs = useStore(state => state.jobs);

  const companyJobs = jobs.filter(j => j.companyId === id && j.status === 'active');

  if (!company) {
    return (
      <div className="container py-16 text-center">
        <p className="text-slate-500">企业不存在</p>
        <Link to="/" className="btn btn-primary mt-4">
          返回职位列表
        </Link>
      </div>
    );
  }

  const nextPhoto = () => {
    if (photoIndex < company.companyPhotos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    }
  };

  const tabs = [
    { id: 'jobs', label: '在招职位', count: companyJobs.length },
    { id: 'info', label: '公司介绍' },
    { id: 'photos', label: '公司相册', count: company.companyPhotos.length },
    { id: 'cert', label: '工商信息' },
  ];

  return (
    <div className="pb-8">
      <div className="relative h-56 md:h-72 bg-gradient-to-r from-primary-700 to-primary-500 overflow-hidden">
        <img
          src={company.coverImage}
          alt={company.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="container">
        <div className="relative -mt-20">
          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-800">{company.name}</h1>
                    {company.certification.hasCertified && (
                      <span className="badge badge-success flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        企业认证
                      </span>
                    )}
                    {company.status === 'pending' && (
                      <span className="badge badge-warning">待审核</span>
                    )}
                  </div>
                  <p className="text-slate-500 mt-1">{company.industry}</p>
                  <div className="flex items-center gap-4 flex-wrap mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {company.scale}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {company.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {company.jobCount}个在招职位
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 md:flex-col lg:flex-row">
                <button className="btn btn-primary">
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  关注公司
                </button>
                <button className="btn btn-secondary">
                  <Globe className="w-4 h-4 mr-1.5" />
                  官方网站
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex-1">
            <div className="card mb-6">
              <div className="border-b border-slate-100">
                <nav className="flex gap-1 px-2 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-1.5 text-xs text-slate-400">({tab.count})</span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'jobs' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">全部职位</h3>
                      <span className="text-sm text-slate-500">共 {companyJobs.length} 个</span>
                    </div>
                    {companyJobs.length > 0 ? (
                      <div className="space-y-4">
                        {companyJobs.map(job => (
                          <JobCard key={job.id} job={job} company={company} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">暂无在招职位</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">公司介绍</h3>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {company.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">{company.scale}</p>
                        <p className="text-xs text-slate-500 mt-0.5">公司规模</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Briefcase className="w-5 h-5 text-accent-600" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">{company.jobCount}</p>
                        <p className="text-xs text-slate-500 mt-0.5">在招职位</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Building2 className="w-5 h-5 text-success-600" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">{company.industry}</p>
                        <p className="text-xs text-slate-500 mt-0.5">所属行业</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <TrendingUp className="w-5 h-5 text-warning-600" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">
                          {company.certification.establishDate || '未公开'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">成立日期</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">公司相册</h3>
                    {company.companyPhotos.length > 0 ? (
                      <div>
                        <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-video">
                          <img
                            src={company.companyPhotos[photoIndex]}
                            alt="公司照片"
                            className="w-full h-full object-cover"
                          />
                          {company.companyPhotos.length > 1 && (
                            <>
                              <button
                                onClick={prevPhoto}
                                disabled={photoIndex === 0}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={nextPhoto}
                                disabled={photoIndex === company.companyPhotos.length - 1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                          {company.companyPhotos.map((photo, index) => (
                            <button
                              key={index}
                              onClick={() => setPhotoIndex(index)}
                              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                photoIndex === index
                                  ? 'border-primary-500'
                                  : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={photo}
                                alt={`照片 ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">暂无公司照片</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'cert' && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">工商信息</h3>
                    {company.certification.hasCertified ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-success-50 rounded-xl">
                          <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-success-600" />
                          </div>
                          <div>
                            <p className="font-medium text-success-800">企业已通过实名认证</p>
                            <p className="text-sm text-success-600">认证时间：{company.certification.establishDate}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-1">公司名称</p>
                            <p className="font-medium text-slate-800">{company.name}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-1">统一社会信用代码</p>
                            <p className="font-medium text-slate-800">{company.certification.creditCode}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-1">法定代表人</p>
                            <p className="font-medium text-slate-800">{company.certification.legalPerson}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-1">注册资本</p>
                            <p className="font-medium text-slate-800">{company.certification.registeredCapital}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-1">成立日期</p>
                            <p className="font-medium text-slate-800">{company.certification.establishDate}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-500 mb-1">公司地址</p>
                            <p className="font-medium text-slate-800">{company.location}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">该企业暂未完成工商认证</p>
                        <p className="text-sm text-slate-400 mt-1">认证信息以企业提交资料为准</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="card p-5 sticky top-20">
              <h3 className="font-semibold text-slate-800 mb-4">公司信息</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">公司地址</p>
                    <p className="text-sm text-slate-700">{company.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">公司行业</p>
                    <p className="text-sm text-slate-700">{company.industry}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">公司规模</p>
                    <p className="text-sm text-slate-700">{company.scale}</p>
                  </div>
                </div>

                {company.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500">官方网站</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 break-all"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">在招职位</span>
                  <span className="font-semibold text-primary-600">{companyJobs.length}个</span>
                </div>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="btn btn-primary w-full mt-3"
                >
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  查看全部职位
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
