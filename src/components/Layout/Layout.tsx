import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              © 2026 智聘平台 版权所有
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-primary-600 transition-colors">关于我们</a>
              <a href="#" className="hover:text-primary-600 transition-colors">用户协议</a>
              <a href="#" className="hover:text-primary-600 transition-colors">隐私政策</a>
              <a href="#" className="hover:text-primary-600 transition-colors">联系我们</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
