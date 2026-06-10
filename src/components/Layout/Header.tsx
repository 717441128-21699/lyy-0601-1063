import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Briefcase,
  User,
  FileText,
  MessageSquare,
  CalendarClock,
  LayoutDashboard,
  ChevronDown,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Header = () => {
  const location = useLocation();
  const totalUnread = useStore(state => state.getTotalUnreadCount());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { path: '/', label: '职位', icon: Briefcase },
    { path: '/resume', label: '简历中心', icon: FileText },
    { path: '/applications', label: '投递管理', icon: User },
    { path: '/interviews', label: '面试安排', icon: CalendarClock },
    { path: '/messages', label: '消息', icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-nav">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">智聘</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.path === '/messages' && totalUnread > 0 && (
                    <span className="ml-0.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {totalUnread}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {totalUnread > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                后台
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                    alt="用户头像"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden lg:block text-sm font-medium text-slate-700">李明远</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-slate-100 py-1 animate-fade-in">
                    <Link
                      to="/resume"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      我的简历
                    </Link>
                    <Link
                      to="/applications"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FileText className="w-4 h-4" />
                      投递记录
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden py-3 border-t border-slate-100 animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.path === '/messages' && totalUnread > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </Link>
              ))}
              <hr className="my-2 border-slate-100" />
              <Link
                to="/admin"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                onClick={() => setShowMobileMenu(false)}
              >
                <LayoutDashboard className="w-5 h-5" />
                后台管理
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
