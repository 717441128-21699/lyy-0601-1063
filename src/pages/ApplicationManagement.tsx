import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  MapPin,
  Calendar,
  FileText,
  Heart,
  Search,
  Filter,
  ChevronDown,
  ArrowRight,
  Mail,
  Phone,
  Star,
} from 'lucide-react';
import { useStore } from '../store/useStore';

const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待处理', color: 'text-warning-700', bgColor: 'bg-warning-50' },
  reviewing: { label: '简历筛选中', color: 'text-primary-700', bgColor: 'bg-primary-50' },
  interview: { label: '面试中', color: 'text-accent-700', bgColor: 'bg-accent-50' },
  offer: { label: '已发Offer', color: 'text-success-700', bgColor: 'bg-success-50' },
  rejected: { label: '未通过', color: 'text-danger-700', bgColor: 'bg-danger-50' },
};

export const ApplicationManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const applications = useStore(state => state.applications);
  const favoriteJobs = useStore(state => state.favoriteJobs);

  const tabs = [
    { id: 'all', label: '全部', count: applications.length },
    { id: 'pending', label: '待处理', count: applications.filter(a => a.status === 'pending').length },
    { id: 'interview', label: '面试中', count: applications.filter(a => a.status === 'interview').length },
    { id: 'offer', label: 'Offer', count: applications.filter(a => a.status === 'offer').length },
    { id: 'rejected', label: '未通过', count: applications.filter(a => a.status === 'rejected').length },
    { id: 'favorites', label: '已收藏', count: favoriteJobs.length },
  ];

  const filteredApplications = activeTab === 'favorites'
    ? []
    : applications.filter(app => {
        if (activeTab !== 'all' && app.status !== activeTab) return false;
        if (searchKeyword) {
          const keyword = searchKeyword.toLowerCase();
          return (
            app.job.title.toLowerCase().includes(keyword) ||
            app.company.name.toLowerCase().includes(keyword)
          );
        }
        return true;
      });

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">我的投递</h1>
            <p className="text-slate-500 mt-1">共 {applications.length} 条投递记录</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索职位或公司..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="input pl-9 w-64"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="card mb-6">
              <div className="border-b border-slate-100 overflow-x-auto">
                <nav className="flex gap-1 px-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                      <span className={`ml-1.5 text-xs ${activeTab === tab.id ? 'text-primary-500' : 'text-slate-400'}`}>
                        ({tab.count})
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4">
                {activeTab === 'favorites' ? (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      我收藏的职位
                    </h3>
                    {favoriteJobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favoriteJobs.map(fav => (
                          <div key={fav.id} className="card card-hover p-4">
                            <div className="flex items-start gap-3">
                              <img
                                src={fav.company.logo}
                                alt={fav.company.name}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                              />
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/job/${fav.job.id}`}
                                  className="text-base font-semibold text-slate-800 hover:text-primary-600 transition-colors truncate block"
                                >
                                  {fav.job.title}
                                </Link>
                                <p className="text-sm text-slate-500 truncate">{fav.company.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                              <span className="text-accent-600 font-semibold">
                                {fav.job.salary.min}-{fav.job.salary.max}K
                              </span>
                              <span className="text-xs text-slate-400">{fav.createdAt} 收藏</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">暂无收藏的职位</p>
                        <Link to="/" className="btn btn-primary mt-4">
                          去浏览职位
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {filteredApplications.length > 0 ? (
                      <div className="space-y-3">
                        {filteredApplications.map(app => {
                          const status = statusMap[app.status];
                          const isExpanded = expandedId === app.id;

                          return (
                            <div
                              key={app.id}
                              className="border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 transition-colors"
                            >
                              <div
                                className="p-4 cursor-pointer"
                                onClick={() => setExpandedId(isExpanded ? null : app.id)}
                              >
                                <div className="flex items-start gap-4">
                                  <img
                                    src={app.company.logo}
                                    alt={app.company.name}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <Link
                                          to={`/job/${app.job.id}`}
                                          className="text-base font-semibold text-slate-800 hover:text-primary-600 transition-colors"
                                          onClick={e => e.stopPropagation()}
                                        >
                                          {app.job.title}
                                        </Link>
                                        <Link
                                          to={`/company/${app.company.id}`}
                                          className="text-sm text-slate-500 hover:text-primary-600 transition-colors block mt-0.5"
                                          onClick={e => e.stopPropagation()}
                                        >
                                          {app.company.name}
                                        </Link>
                                      </div>
                                      <span className={`badge ${status.bgColor} ${status.color} flex-shrink-0`}>
                                        {status.label}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                      <span className="text-accent-600 font-medium">
                                        {app.job.salary.min}-{app.job.salary.max}K
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {app.job.location.city}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {app.applyDate}
                                      </span>
                                    </div>
                                  </div>
                                  <ChevronDown
                                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                  />
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="px-4 pb-4 border-t border-slate-100">
                                  <div className="pt-4">
                                    <h4 className="text-sm font-semibold text-slate-800 mb-3">投递进度</h4>
                                    <div className="relative">
                                      <div className="space-y-4">
                                        {app.timeline.map((item, index) => (
                                          <div key={item.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                              <div
                                                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                                  item.isCurrent
                                                    ? 'bg-primary-500 ring-4 ring-primary-100'
                                                    : index === app.timeline.length - 1
                                                    ? 'bg-slate-300'
                                                    : 'bg-success-500'
                                                }`}
                                              />
                                              {index < app.timeline.length - 1 && (
                                                <div className="w-0.5 h-full bg-slate-200 mt-1 flex-1" />
                                              )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                              <div className="flex items-center justify-between">
                                                <span
                                                  className={`text-sm font-medium ${
                                                    item.isCurrent ? 'text-primary-600' : 'text-slate-700'
                                                  }`}
                                                >
                                                  {item.status}
                                                </span>
                                                <span className="text-xs text-slate-400">{item.date}</span>
                                              </div>
                                              <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                      <Link
                                        to={`/job/${app.job.id}`}
                                        className="btn btn-primary flex-1 text-sm"
                                      >
                                        <Briefcase className="w-4 h-4 mr-1.5" />
                                        查看职位
                                      </Link>
                                      {app.status === 'interview' && (
                                        <Link
                                          to="/interviews"
                                          className="btn btn-accent flex-1 text-sm"
                                        >
                                          <Calendar className="w-4 h-4 mr-1.5" />
                                          面试安排
                                        </Link>
                                      )}
                                      <button className="btn btn-secondary text-sm">
                                        <Mail className="w-4 h-4 mr-1.5" />
                                        联系HR
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">暂无投递记录</p>
                        <Link to="/" className="btn btn-primary mt-4">
                          去投递职位
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="card p-5 sticky top-20">
              <h3 className="font-semibold text-slate-800 mb-4">投递统计</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm text-slate-700">总投递数</span>
                  </div>
                  <span className="text-lg font-bold text-primary-600">{applications.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-accent-600" />
                    </div>
                    <span className="text-sm text-slate-700">面试中</span>
                  </div>
                  <span className="text-lg font-bold text-accent-600">
                    {applications.filter(a => a.status === 'interview').length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-success-600" />
                    </div>
                    <span className="text-sm text-slate-700">Offer数</span>
                  </div>
                  <span className="text-lg font-bold text-success-600">
                    {applications.filter(a => a.status === 'offer').length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-danger-600" />
                    </div>
                    <span className="text-sm text-slate-700">未通过</span>
                  </div>
                  <span className="text-lg font-bold text-danger-600">
                    {applications.filter(a => a.status === 'rejected').length}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <h4 className="text-sm font-medium text-slate-700 mb-3">求职小贴士</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-start gap-2">
                    <Star className="w-3.5 h-3.5 text-accent-500 mt-0.5 flex-shrink-0" />
                    完善简历可以提高通过率
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-3.5 h-3.5 text-accent-500 mt-0.5 flex-shrink-0" />
                    主动出击，多投递合适的职位
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-3.5 h-3.5 text-accent-500 mt-0.5 flex-shrink-0" />
                    面试前做好充分准备
                  </li>
                </ul>
                <Link to="/resume" className="btn btn-primary w-full mt-4 text-sm">
                  <FileText className="w-4 h-4 mr-1.5" />
                  优化简历
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
