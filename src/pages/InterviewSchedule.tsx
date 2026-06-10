import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  User,
  FileText,
  AlertCircle,
  Check,
  X,
  Info,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Interview } from '../types';

const interviewTypeMap: Record<string, { label: string; icon: any; color: string }> = {
  video: { label: '视频面试', icon: Video, color: 'text-primary-600' },
  onsite: { label: '现场面试', icon: Building, color: 'text-accent-600' },
  phone: { label: '电话面试', icon: Phone, color: 'text-success-600' },
};

const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待确认', color: 'text-warning-700', bgColor: 'bg-warning-50' },
  confirmed: { label: '已确认', color: 'text-primary-700', bgColor: 'bg-primary-50' },
  rescheduled: { label: '已改期', color: 'text-accent-700', bgColor: 'bg-accent-50' },
  cancelled: { label: '已取消', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  completed: { label: '已完成', color: 'text-success-700', bgColor: 'bg-success-50' },
  no_show: { label: '未到场', color: 'text-danger-700', bgColor: 'bg-danger-50' },
};

export const InterviewSchedule = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [newTime, setNewTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const interviews = useStore(state => state.interviews);
  const confirmInterview = useStore(state => state.confirmInterview);
  const rescheduleInterview = useStore(state => state.rescheduleInterview);

  const upcomingInterviews = interviews.filter(i =>
    ['pending', 'confirmed', 'rescheduled'].includes(i.status)
  );

  const pastInterviews = interviews.filter(i =>
    ['completed', 'cancelled', 'no_show'].includes(i.status)
  );

  const displayInterviews = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;

  const handleReschedule = (interview: Interview) => {
    setSelectedInterview(interview);
    setNewTime('');
    setRescheduleReason('');
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    if (selectedInterview && newTime && rescheduleReason) {
      rescheduleInterview(selectedInterview.id, newTime, rescheduleReason);
      setShowRescheduleModal(false);
      setSelectedInterview(null);
    }
  };

  const handleConfirm = (interviewId: string) => {
    confirmInterview(interviewId);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">面试安排</h1>
            <p className="text-slate-500 mt-1">
              共 {upcomingInterviews.length} 场待参加面试
            </p>
          </div>
        </div>

        {upcomingInterviews.length > 0 && (
          <div className="card p-5 mb-6 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">即将到来的面试</h3>
                <p className="text-sm text-slate-500">最近的一场面试</p>
              </div>
            </div>
            {(() => {
              const nextInterview = upcomingInterviews[0];
              const typeInfo = interviewTypeMap[nextInterview.type];
              const statusInfo = statusMap[nextInterview.status];
              return (
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={nextInterview.companyLogo}
                        alt={nextInterview.companyName}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-800">{nextInterview.jobTitle}</h4>
                        <p className="text-sm text-slate-500">{nextInterview.companyName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`badge ${statusInfo.bgColor} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <span className={`badge bg-slate-100 text-slate-600 flex items-center gap-1`}>
                            <typeInfo.icon className={`w-3 h-3 ${typeInfo.color}`} />
                            {typeInfo.label}
                          </span>
                          <span className="badge bg-slate-100 text-slate-600">
                            第{nextInterview.round}轮
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        {formatTime(nextInterview.time)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(nextInterview.time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {nextInterview.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleConfirm(nextInterview.id)}
                          className="btn btn-primary flex-1 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          确认参加
                        </button>
                        <button
                          onClick={() => handleReschedule(nextInterview)}
                          className="btn btn-secondary flex-1 text-sm"
                        >
                          <RefreshCw className="w-4 h-4 mr-1.5" />
                          申请改期
                        </button>
                      </>
                    )}
                    {nextInterview.status === 'confirmed' && (
                      <>
                        <button className="btn btn-primary flex-1 text-sm">
                          <Video className="w-4 h-4 mr-1.5" />
                          进入面试
                        </button>
                        <button
                          onClick={() => handleReschedule(nextInterview)}
                          className="btn btn-secondary flex-1 text-sm"
                        >
                          <RefreshCw className="w-4 h-4 mr-1.5" />
                          申请改期
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="card">
              <div className="border-b border-slate-100">
                <nav className="flex gap-1 px-4">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'upcoming'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    待参加 ({upcomingInterviews.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'past'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    历史面试 ({pastInterviews.length})
                  </button>
                </nav>
              </div>

              <div className="p-4">
                {displayInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {displayInterviews.map(interview => {
                      const typeInfo = interviewTypeMap[interview.type];
                      const statusInfo = statusMap[interview.status];

                      return (
                        <div
                          key={interview.id}
                          className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <img
                                src={interview.companyLogo}
                                alt={interview.companyName}
                                className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-slate-800">
                                    {interview.jobTitle}
                                  </h4>
                                  <span className={`badge ${statusInfo.bgColor} ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-0.5">
                                  {interview.companyName}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(interview.time)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatTime(interview.time)} - {formatTime(interview.endTime)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <typeInfo.icon className={`w-3.5 h-3.5 ${typeInfo.color}`} />
                                    {typeInfo.label}
                                  </span>
                                  <span className="badge bg-slate-100 text-slate-600">
                                    第{interview.round}轮
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-slate-700">
                                  面试官：{interview.interviewer} · {interview.interviewerTitle}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 mt-2">
                              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-slate-700">{interview.location}</p>
                              </div>
                            </div>
                            {interview.meetingLink && (
                              <div className="flex items-start gap-2 mt-2">
                                <Video className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <a
                                  href={interview.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary-600 hover:text-primary-700 break-all"
                                >
                                  {interview.meetingLink}
                                </a>
                              </div>
                            )}
                            {interview.notes && (
                              <div className="flex items-start gap-2 mt-2">
                                <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-600">{interview.notes}</p>
                              </div>
                            )}
                          </div>

                          {interview.rescheduleHistory.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <p className="text-xs text-slate-500 mb-2">改约记录：</p>
                              {interview.rescheduleHistory.map(rs => (
                                <div
                                  key={rs.id}
                                  className="flex items-center gap-2 text-xs text-slate-500 py-1"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>
                                    从 {rs.originalTime} 改到 {rs.newTime}
                                  </span>
                                  <span
                                    className={`badge ${
                                      rs.status === 'approved'
                                        ? 'bg-success-50 text-success-600'
                                        : rs.status === 'rejected'
                                        ? 'bg-danger-50 text-danger-600'
                                        : 'bg-warning-50 text-warning-600'
                                    }`}
                                  >
                                    {rs.status === 'approved' ? '已通过' : rs.status === 'rejected' ? '已拒绝' : '待处理'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {activeTab === 'upcoming' && (
                            <div className="flex gap-2 mt-4">
                              {interview.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleConfirm(interview.id)}
                                    className="btn btn-primary flex-1 text-sm"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1.5" />
                                    确认参加
                                  </button>
                                  <button
                                    onClick={() => handleReschedule(interview)}
                                    className="btn btn-secondary flex-1 text-sm"
                                  >
                                    <RefreshCw className="w-4 h-4 mr-1.5" />
                                    申请改期
                                  </button>
                                </>
                              )}
                              {interview.status === 'confirmed' && (
                                <>
                                  <button className="btn btn-primary flex-1 text-sm">
                                    <Video className="w-4 h-4 mr-1.5" />
                                    进入面试
                                  </button>
                                  <button
                                    onClick={() => handleReschedule(interview)}
                                    className="btn btn-secondary flex-1 text-sm"
                                  >
                                    <RefreshCw className="w-4 h-4 mr-1.5" />
                                    申请改期
                                  </button>
                                </>
                              )}
                              {interview.status === 'rescheduled' && (
                                <span className="flex-1 text-center text-sm text-accent-600 py-2">
                                  <Clock className="w-4 h-4 inline mr-1.5" />
                                  改期申请处理中
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      {activeTab === 'upcoming' ? '暂无待参加的面试' : '暂无历史面试记录'}
                    </p>
                    {activeTab === 'upcoming' && (
                      <Link to="/" className="btn btn-primary mt-4">
                        去投递职位
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="card p-5 sticky top-20">
              <h3 className="font-semibold text-slate-800 mb-4">面试小贴士</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>提前10-15分钟进入面试会场</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>准备好自我介绍和项目经历</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>测试好网络、摄像头和麦克风</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>着正装，保持良好精神状态</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span>准备几个想向面试官提问的问题</span>
                </li>
              </ul>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <h4 className="text-sm font-medium text-slate-700 mb-3">常见问题</h4>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700">
                    如何取消面试？
                  </button>
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700">
                    面试迟到了怎么办？
                  </button>
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700">
                    如何准备技术面试？
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showRescheduleModal && selectedInterview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md animate-slide-up">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary-600" />
                  申请改期
                </h3>
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-slate-600">
                    原面试时间：
                    <span className="font-medium text-slate-800">
                      {selectedInterview.time}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                      期望新时间 <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                      改期原因 <span className="text-danger-500">*</span>
                    </label>
                    <textarea
                      value={rescheduleReason}
                      onChange={e => setRescheduleReason(e.target.value)}
                      placeholder="请说明改期原因..."
                      className="input h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowRescheduleModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmReschedule}
                    disabled={!newTime || !rescheduleReason}
                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交申请
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
