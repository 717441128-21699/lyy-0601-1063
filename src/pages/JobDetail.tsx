import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Share2,
  Flag,
  Building2,
  Users,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  Send,
  X,
  FileText,
  Paperclip,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { JobCard } from '../components/JobCard';

export const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [resumeType, setResumeType] = useState<'online' | 'attachment'>('online');
  const [applySuccess, setApplySuccess] = useState(false);

  const job = useStore(state => state.getJobById(id || ''));
  const company = useStore(state => state.getCompanyById(job?.companyId || ''));
  const isFavorite = useStore(state => state.isFavorite(id || ''));
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const applyToJob = useStore(state => state.applyToJob);
  const hasApplied = useStore(state => state.hasApplied(id || ''));
  const getSimilarJobs = useStore(state => state.getSimilarJobs);
  const companies = useStore(state => state.companies);
  const resume = useStore(state => state.resume);

  const similarJobs = job ? getSimilarJobs(job.id, 4) : [];

  if (!job || !company) {
    return (
      <div className="container py-16 text-center">
        <p className="text-slate-500">职位不存在</p>
        <Link to="/" className="btn btn-primary mt-4">
          返回职位列表
        </Link>
      </div>
    );
  }

  const handleApply = () => {
    applyToJob(job.id, resumeType);
    setApplySuccess(true);
    setTimeout(() => {
      setShowApplyModal(false);
      setApplySuccess(false);
    }, 2000);
  };

  const reportReasons = [
    '虚假招聘',
    '薪资不实',
    '公司信息不实',
    '疑似传销/诈骗',
    '其他违规',
  ];

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="card p-6 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-2xl font-bold text-accent-600">
                      {job.salary.min}-{job.salary.max}K
                    </span>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location.city} · {job.location.district}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {job.education}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(job.id)}
                    className={`p-3 rounded-xl transition-all ${
                      isFavorite
                        ? 'bg-red-50 text-red-500'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title={isFavorite ? '取消收藏' : '收藏'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                    title="分享"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                    title="举报"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {job.tags.map(tag => (
                  <span key={tag} className="badge badge-primary">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.publishDate}发布
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {job.viewCount}次浏览
                </span>
                <span className="flex items-center gap-1">
                  <Send className="w-4 h-4" />
                  {job.applyCount}人投递
                </span>
              </div>
            </div>

            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">职位描述</h2>
              <p className="text-slate-600 leading-relaxed mb-6">{job.description}</p>

              <h3 className="text-base font-semibold text-slate-800 mb-3">任职要求</h3>
              <ul className="space-y-2 mb-6">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-base font-semibold text-slate-800 mb-3">福利待遇</h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map(benefit => (
                  <span
                    key={benefit}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-success-50 text-success-700 rounded-lg text-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">工作地址</h2>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    {job.location.city}市 {job.location.district}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">{job.location.address}</p>
                </div>
              </div>
              <div className="mt-4 h-40 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <span className="text-sm">地图位置</span>
              </div>
            </div>

            {similarJobs.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span>相似职位推荐</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {similarJobs.map(similarJob => {
                    const simCompany = companies.find(c => c.id === similarJob.companyId);
                    if (!simCompany) return null;
                    return (
                      <JobCard key={similarJob.id} job={similarJob} company={simCompany} />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="card p-5 sticky top-20">
              <Link to={`/company/${company.id}`} className="flex items-center gap-3 mb-4">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100"
                />
                <div>
                  <h3 className="font-semibold text-slate-800 hover:text-primary-600 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-slate-500">{company.industry}</p>
                </div>
              </Link>

              <div className="space-y-2 py-4 border-y border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  {company.scale}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {company.jobCount}个在招职位
                </div>
                {company.certification.hasCertified && (
                  <div className="flex items-center gap-2 text-sm text-success-600">
                    <CheckCircle className="w-4 h-4" />
                    企业已认证
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm text-slate-500 line-clamp-3">{company.description}</p>
                <Link
                  to={`/company/${company.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-flex items-center gap-1"
                >
                  查看公司详情
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {hasApplied ? (
                  <button disabled className="btn btn-primary w-full opacity-60 cursor-not-allowed">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    已投递
                  </button>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="btn btn-primary btn-lg w-full"
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    立即投递
                  </button>
                )}
                <button
                  onClick={() => toggleFavorite(job.id)}
                  className={`btn w-full ${isFavorite ? 'btn-secondary' : 'btn-secondary'}`}
                >
                  <Heart className={`w-4 h-4 mr-1.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? '已收藏' : '收藏职位'}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  HR: {job.recruiterName}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {job.recruiterTitle}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
            {applySuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">投递成功！</h3>
                <p className="text-slate-500">HR会尽快查看您的简历</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="text-lg font-semibold">投递简历</h3>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-600 mb-4">
                    投递职位：<span className="font-medium text-slate-800">{job.title}</span>
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    公司：<span className="font-medium text-slate-800">{company.name}</span>
                  </p>

                  <div className="space-y-3 mb-6">
                    <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        name="resumeType"
                        checked={resumeType === 'online'}
                        onChange={() => setResumeType('online')}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800">使用在线简历</span>
                          <span className="badge badge-primary">完整度 {resume.completeness}%</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {resume.basicInfo.name} · {resume.basicInfo.jobStatus}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        name="resumeType"
                        checked={resumeType === 'attachment'}
                        onChange={() => setResumeType('attachment')}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-800">使用附件简历</span>
                        </div>
                        {resume.attachments.length > 0 ? (
                          <p className="text-sm text-slate-500 mt-1">
                            {resume.attachments[0].name}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400 mt-1">暂无附件简历</p>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowApplyModal(false)}
                      className="btn btn-secondary flex-1"
                    >
                      取消
                    </button>
                    <button onClick={handleApply} className="btn btn-primary flex-1">
                      确认投递
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning-500" />
                举报职位
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 mb-4">请选择举报原因</p>
              <div className="space-y-2 mb-4">
                {reportReasons.map(reason => (
                  <button
                    key={reason}
                    onClick={() => setReportReason(reason)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                      reportReason === reason
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <label className="text-sm text-slate-600 mb-2 block">补充说明（选填）</label>
                <textarea
                  value={reportDescription}
                  onChange={e => setReportDescription(e.target.value)}
                  placeholder="请详细描述违规情况..."
                  className="input h-24 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    alert('举报已提交，我们会尽快处理');
                  }}
                  className="btn btn-primary flex-1"
                >
                  提交举报
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
