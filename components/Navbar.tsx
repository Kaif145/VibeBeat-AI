
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: 'dashboard' | 'reels' | 'admin' | 'saved') => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { label: string; view: 'dashboard' | 'reels' | 'admin' | 'saved'; role?: UserRole }[] = [
    { label: 'Discover', view: 'dashboard' },
    { label: 'Feed', view: 'reels' },
    { label: 'Saved', view: 'saved' },
    { label: 'Admin', view: 'admin', role: UserRole.ADMIN },
  ];

  const handleNavigate = (view: 'dashboard' | 'reels' | 'admin' | 'saved') => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 px-4 md:px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => handleNavigate('dashboard')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center transition group-hover:rotate-12">
            <span className="text-white font-black text-xl">V</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            VibeBeat AI
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            (!item.role || item.role === user.role) && (
              <button 
                key={item.view}
                onClick={() => handleNavigate(item.view)}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-purple-400 ${
                  currentView === item.view ? 'text-purple-400' : 'text-gray-500'
                }`}
              >
                {item.label}
              </button>
            )
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black truncate max-w-[100px]">{user.name}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{user.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="hidden sm:block bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition border border-white/5"
          >
            Logout
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bottom-0 bg-black/95 backdrop-blur-xl z-[49] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-8 gap-6 h-full overflow-y-auto">
            {navItems.map((item) => (
              (!item.role || item.role === user.role) && (
                <button 
                  key={item.view}
                  onClick={() => handleNavigate(item.view)}
                  className={`text-left text-3xl font-black uppercase tracking-widest transition-all ${
                    currentView === item.view ? 'text-purple-500 pl-4' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </button>
              )
            ))}
            <div className="mt-auto pt-8 border-t border-neutral-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{user.name[0]}</span>
                </div>
                <div>
                   <p className="text-white font-black">{user.name}</p>
                   <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full bg-red-500/10 text-red-500 font-black uppercase tracking-widest py-5 rounded-2xl border border-red-500/20 active:bg-red-500/20 transition-all"
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
