
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
            className="md:hidden p-2 text-gray-400 hover:text-white"
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
        <div className="md:hidden absolute top-full left-0 w-full bg-neutral-900 border-b border-neutral-800 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              (!item.role || item.role === user.role) && (
                <button 
                  key={item.view}
                  onClick={() => handleNavigate(item.view)}
                  className={`text-left text-lg font-black uppercase tracking-widest transition ${
                    currentView === item.view ? 'text-purple-400' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              )
            ))}
            <div className="h-[1px] bg-neutral-800 my-2"></div>
            <button 
              onClick={onLogout}
              className="text-left text-lg font-black uppercase tracking-widest text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
