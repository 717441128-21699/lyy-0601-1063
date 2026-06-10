import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Flag,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronRight,
  Eye,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  FileText,
  Shield,
  Settings,
  ChevronDown,
  BarChart3,
  Calendar,
  Trash,
  ScrollText,
  User,
} from 'lucide-react';
import { useStore } from '../store/useStore';

const reportStatusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待处理', color: 'text-warning-700', bgColor: 'bg-warning-50' },
  processing: { label: '处理中', color: 'text-primary-700', bgColor: 'bg-primary-50' },
  resolved: { label: '已解决', color: 'text-success-700', bgColor: 'bg-success-50' },
  rejected: { label: '已驳回', color: 'text-danger-700', bgColor: 'bg-danger-50' },
};

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [reportFilter, setReportFilter] = useState('all');

  const companies = useStore((state) => state.companies);
  const jobs = useStore((state) => state.jobs);
  const reports = useStore((state) => state.reports);
  const auditLogs = useStore((state) => state.auditLogs);
  const approveCompany = useStore((state) => state.approveCompany);
  const rejectCompany = useStore((state) => state.rejectCompany);
  const approveJob = useStore((state) => state.approveJob);
  const rejectJob = useStore((state) => state.rejectJob);
  const offlineJob = useStore((state) => state.offlineJob);
  const resolveReport = useStore((state) => state.resolveReport);
  const rejectReport = useStore((state) => state.rejectReport);
  const getCompanyById = useStore((state) => state.getCompanyById);

  const pendingCompanies = companies.filter((c) => c.status === 'pending');
  const pendingJobs = jobs.filter((j) => j.status === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const totalCompanies = companies.length;
  const totalJobs = jobs.filter((j) => j.status === 'active').length;
  const totalUsers = 12586;
  const todayApplications = 156;

  const adminStats = {
    totalCompanies,
    totalJobs,
    totalUsers,
    todayApplications,
    pendingCompanies: pendingCompanies.length,
    pendingJobs: pendingJobs.length,
    pendingReports: pendingReports.length,
    weeklyTrend: [
      { date: '周一', applications: 280, jobs: 22 },
      { date: '周二', applications: 310, jobs: 25 },
      { date: '周三', applications: 295, jobs: 18 },
      { date: '周四', applications: 330, jobs: 28 },
      { date: '周五', applications: 350, jobs: 30 },
      { date: '周六', applications: 200, jobs: 15 },
      { date: '周日', applications: 180, jobs: 12 },
    ],
  };

  const sidebarItems = [
    { id: 'overview', label: '数据概览', icon: LayoutDashboard },
    { id: 'companies', label: '企业审核', icon: Building2, badge: pendingCompanies.length },
    { id: 'jobs', label: '职位审核', icon: Briefcase, badge: pendingJobs.length },
    { id: 'reports', label: '举报管理', icon: Flag, badge: pendingReports.length },
    { id: 'auditLogs', label: '操作记录', icon: ScrollText, badge: auditLogs.length > 0 ? auditLogs.length : undefined },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  const filteredCompanies = companies.filter((c) => {
    if (companyFilter !== 'all' && c.status !== companyFilter) return false;
    if (searchKeyword && !c.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  const filteredJobs = jobs.filter((j) => {
    if (jobFilter !== 'all' && j.status !== jobFilter) return false;
    if (searchKeyword && !j.title.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  const filteredReports = reports.filter((r) => {
    if (reportFilter !== 'all' && r.status !== reportFilter) return false;
    if (searchKeyword && !r.targetName.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  const handleApproveCompany = (companyId: string) => {
    if (confirm('确定通过该企业的认证？')) {
      approveCompany(companyId);
    }
  };

  const handleRejectCompany = (companyId: string) => {
    if (confirm('确定拒绝该企业的认证？')) {
      rejectCompany(companyId);
    }
  };

  const handleApproveJob = (jobId: string) => {
    if (confirm('确定通过该职位审核并上架？')) {
      approveJob(jobId);
    }
  };

  const handleRejectJob = (jobId: string) => {
    if (confirm('确定拒绝该职位？')) {
      rejectJob(jobId);
    }
  };

  const handleOfflineJob = (jobId: string) => {
    if (confirm('确定下架该职位？')) {
      offlineJob(jobId);
    }
  };

  const handleResolveReport = (reportId: string) => {
    if (confirm('确定将该举报标记为已解决？')) {
      resolveReport(reportId);
    }
  };

  const handleRejectReport = (reportId: string) => {
    if (confirm('确定驳回该举报？')) {
      rejectReport(reportId);
    }
  };

  const jobStatusLabels: Record<string, string> = {
    active: '已上架',
    pending: '待审核',
    offline: '已下架',
    rejected: '已拒绝',
  };

  const companyStatusLabels: Record<string, string> = {
    approved: '已通过',
    pending: '待审核',
    rejected: '已拒绝',
  };

  const renderOverview = () => (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">数据概览</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-xs text-success-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{adminStats.totalCompanies}</p>
          <p className="text-sm text-slate-500 mt-1">企业总数</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-accent-600" />
            </div>
            <span className="text-xs text-success-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{adminStats.totalJobs}</p>
          <p className="text-sm text-slate-500 mt-1">在招职位</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-success-600" />
            </div>
            <span className="text-xs text-success-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +15%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {adminStats.totalUsers.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 mt-1">用户总数</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-warning-600" />
            </div>
            <span className="text-xs text-danger-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +5%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{adminStats.todayApplications}</p>
          <p className="text-sm text-slate-500 mt-1">今日投递</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待审核企业</p>
              <p className="text-xl font-bold text-slate-800">
                {adminStats.pendingCompanies}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('companies')}
            className="w-full btn btn-secondary text-sm"
          >
            去审核
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待审核职位</p>
              <p className="text-xl font-bold text-slate-800">
                {adminStats.pendingJobs}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('jobs')}
            className="w-full btn btn-secondary text-sm"
          >
            去审核
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <Flag className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待处理举报</p>
              <p className="text-xl font-bold text-slate-800">
                {adminStats.pendingReports}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="w-full btn btn-secondary text-sm"
          >
            去处理
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            本周数据趋势
          </h3>
        </div>
        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {adminStats.weeklyTrend.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-1 h-48">
                <div
                  className="w-3 bg-primary-200 rounded-t transition-all hover:bg-primary-300"
                  style={{ height: `${(item.applications / 350) * 100}%` }}
                  title={`投递: ${item.applications}`}
                />
                <div
                  className="w-3 bg-accent-400 rounded-t transition-all hover:bg-accent-500"
                  style={{ height: `${(item.jobs / 30) * 100}%` }}
                  title={`职位: ${item.jobs}`}
                />
              </div>
              <span className="text-xs text-slate-500">{item.date}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-200 rounded" />
            <span className="text-sm text-slate-600">投递数</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent-400 rounded" />
            <span className="text-sm text-slate-600">新增职位</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-800">企业审核</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索企业..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="input pl-9 w-64"
          />
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500">状态筛选：</span>
            {[
              { value: 'all', label: '全部' },
              { value: 'pending', label: '待审核' },
              { value: 'approved', label: '已通过' },
              { value: 'rejected', label: '已拒绝' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setCompanyFilter(status.value)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  companyFilter === status.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCompanies.map((company) => (
          <div key={company.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-slate-800">{company.name}</h4>
                    <span
                      className={`badge ${
                        company.status === 'pending'
                          ? 'badge-warning'
                          : company.status === 'approved'
                          ? 'badge-success'
                          : 'badge-danger'
                      }`}
                    >
                      {companyStatusLabels[company.status] || company.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {company.industry} · {company.scale}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {company.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {company.jobCount}个职位
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {company.certification.establishDate}成立
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="btn btn-secondary btn-sm">
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  查看
                </button>
                {company.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleRejectCompany(company.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      拒绝
                    </button>
                    <button
                      onClick={() => handleApproveCompany(company.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      通过
                    </button>
                  </>
                )}
                {company.status === 'approved' && (
                  <button
                    onClick={() => handleRejectCompany(company.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash className="w-3.5 h-3.5 mr-1" />
                    下架
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-success-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无企业数据</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderJobs = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-800">职位审核</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索职位..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="input pl-9 w-64"
          />
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500">状态筛选：</span>
            {[
              { value: 'all', label: '全部' },
              { value: 'pending', label: '待审核' },
              { value: 'active', label: '已上架' },
              { value: 'offline', label: '已下架' },
              { value: 'rejected', label: '已拒绝' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setJobFilter(status.value)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  jobFilter === status.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredJobs.map((job) => {
            const company = getCompanyById(job.companyId);
            const isExpanded = expandedJobId === job.id;

            return (
              <div key={job.id} className="p-4">
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={company?.logo}
                      alt={company?.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-800">{job.title}</h4>
                        <span
                          className={`badge ${
                            job.status === 'pending'
                              ? 'badge-warning'
                              : job.status === 'active'
                              ? 'badge-success'
                              : job.status === 'offline'
                              ? 'bg-slate-100 text-slate-600'
                              : 'badge-danger'
                          }`}
                        >
                          {jobStatusLabels[job.status] || job.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{company?.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
                        <span className="text-accent-600 font-medium">
                          {job.salary.min}-{job.salary.max}K
                        </span>
                        <span>
                          {job.location.city} · {job.location.district}
                        </span>
                        <span>{job.experience}</span>
                        <span>{job.education}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-slate-700 mb-2">职位描述</h5>
                        <p className="text-sm text-slate-600">{job.description}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-slate-700 mb-2">任职要求</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {job.requirements.slice(0, 4).map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary-500">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      {job.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleRejectJob(job.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <X className="w-3.5 h-3.5 mr-1" />
                            拒绝
                          </button>
                          <button
                            onClick={() => handleApproveJob(job.id)}
                            className="btn btn-primary btn-sm"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            通过并上架
                          </button>
                        </>
                      )}
                      {job.status === 'active' && (
                        <button
                          onClick={() => handleOfflineJob(job.id)}
                          className="btn btn-secondary btn-sm"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          下架职位
                        </button>
                      )}
                      {(job.status === 'offline' || job.status === 'rejected') && (
                        <button
                          onClick={() => handleApproveJob(job.id)}
                          className="btn btn-primary btn-sm"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          重新上架
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {!isExpanded && (
                  <div className="flex justify-end gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                    {job.status === 'pending' && (
                      <>
                        <button className="btn btn-secondary btn-sm">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          查看详情
                        </button>
                        <button
                          onClick={() => handleRejectJob(job.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          拒绝
                        </button>
                        <button
                          onClick={() => handleApproveJob(job.id)}
                          className="btn btn-primary btn-sm"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          通过
                        </button>
                      </>
                    )}
                    {job.status === 'active' && (
                      <button
                        onClick={() => handleOfflineJob(job.id)}
                        className="btn btn-secondary btn-sm"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        下架
                      </button>
                    )}
                    {(job.status === 'offline' || job.status === 'rejected') && (
                      <button
                        onClick={() => handleApproveJob(job.id)}
                        className="btn btn-primary btn-sm"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        上架
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-success-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无职位数据</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-800">举报管理</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索举报..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="input pl-9 w-64"
          />
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500">状态筛选：</span>
            {[
              { value: 'all', label: '全部' },
              { value: 'pending', label: '待处理' },
              { value: 'processing', label: '处理中' },
              { value: 'resolved', label: '已解决' },
              { value: 'rejected', label: '已驳回' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setReportFilter(status.value)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  reportFilter === status.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredReports.map((report) => {
            const statusInfo = reportStatusMap[report.status];

            return (
              <div key={report.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 ${statusInfo.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Flag className={`w-5 h-5 ${statusInfo.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-slate-800">{report.targetName}</h4>
                        <span className={`badge ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="badge bg-slate-100 text-slate-600">
                          {report.type === 'job'
                            ? '职位'
                            : report.type === 'company'
                            ? '企业'
                            : '用户'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="text-slate-500">举报原因：</span>
                        {report.reason}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        举报人：{report.reporterName} · {report.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleRejectReport(report.id)}
                          className="btn btn-secondary btn-sm"
                        >
                          驳回
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id)}
                          className="btn btn-primary btn-sm"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          处理
                        </button>
                      </>
                    )}
                    {report.status !== 'pending' && (
                      <span className="text-sm text-slate-400">
                      {report.handledAt} 处理
                    </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Flag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无举报数据</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">用户管理</h2>
      <div className="card">
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">用户管理功能开发中...</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">系统设置</h2>
      <div className="card">
        <div className="text-center py-12">
        <Settings className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">系统设置功能开发中...</p>
      </div>
    </div>
    </div>
  );

  const renderAuditLogs = () => {
    const targetTypeLabels: Record<string, { label: string; color: string; bgColor: string }> = {
      company: { label: '企业', color: 'text-primary-700', bgColor: 'bg-primary-50' },
      job: { label: '职位', color: 'text-accent-700', bgColor: 'bg-accent-50' },
      report: { label: '举报', color: 'text-warning-700', bgColor: 'bg-warning-50' },
    };

    const filteredLogs = searchKeyword
      ? auditLogs.filter(
          (log) =>
            log.targetName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            log.action.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            log.operatorName.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      : auditLogs;

    return (
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">操作记录</h2>
        <div className="card">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索操作对象、操作内容或操作人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="input pl-9 w-full md:w-80"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const typeInfo = targetTypeLabels[log.targetType] || {
                label: log.targetType,
                color: 'text-slate-700',
                bgColor: 'bg-slate-50',
              };

              return (
                <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 ${typeInfo.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <ScrollText className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`badge ${typeInfo.bgColor} ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <span className="font-medium text-slate-800">{log.targetName}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-medium text-primary-600">{log.operatorName}</span>
                        <span className="text-slate-500 mx-1">·</span>
                        {log.action}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          操作人ID: {log.operatorId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                {searchKeyword ? '未找到匹配的操作记录' : '暂无操作记录'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'companies':
        return renderCompanies();
      case 'jobs':
        return renderJobs();
      case 'reports':
        return renderReports();
      case 'auditLogs':
        return renderAuditLogs();
      case 'users':
        return renderUsers();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="py-8">
      <div className="container">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">管理后台</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="card p-3 sticky top-20">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSearchKeyword('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 bg-danger-500 text-white text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">管理员</p>
                    <p className="text-xs text-slate-500">admin@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
