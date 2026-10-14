import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

const NGOLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOverview = location.pathname === '/dashboard/ngo' || location.pathname === '/dashboard/ngo/overview';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="w-full bg-slate-50 min-h-screen relative shadow-sm">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between">
          {!isOverview ? (
            <button 
              onClick={() => navigate('/dashboard/ngo/overview')}
              className="flex items-center text-slate-600 hover:text-slate-900 font-bold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Menu</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <Logo className="w-12 h-12" />
              <span className="font-black text-2xl text-slate-900 tracking-tight">FlashFood</span>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 pb-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default NGOLayout;
