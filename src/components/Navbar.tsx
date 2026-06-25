import React from 'react';
import { Camera, LogIn, Shield, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onAdminLoginClick: () => void;
  onAdminLogout: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onAdminLoginClick,
  onAdminLogout,
}: NavbarProps) {
  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'book', label: 'Book Online' },
    { id: 'track', label: 'Track Order' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <header id="app-header" className="w-full bg-black border-b border-[#D4AF37]/30 z-50">
      {/* Top Bar with Admin button, Welcome banner and Logo */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-[#D4AF37]/10 flex-wrap gap-2">
        {/* Top Left: Admin Login/Logout */}
        <div id="top-left-admin">
          {isAdminLoggedIn ? (
            <button
              id="btn-admin-logout"
              onClick={onAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-xs font-medium tracking-wider"
            >
              <Shield className="w-3.5 h-3.5" />
              ADMIN DASHBOARD
            </button>
          ) : (
            <button
              id="btn-admin-login-trigger"
              onClick={onAdminLoginClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-xs font-medium tracking-wider"
            >
              <LogIn className="w-3.5 h-3.5" />
              ADMIN LOGIN
            </button>
          )}
        </div>

        {/* Top Center: Welcome Message */}
        <div id="top-center-banner" className="text-center">
          <span className="text-xs sm:text-sm font-light uppercase tracking-[0.25em] text-[#D4AF37] animate-pulse">
            Welcome to Gupta Photo Studio
          </span>
        </div>

        {/* Top Right: Uploaded Logo Representation */}
        <div id="top-right-logo" className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">Established 2016</span>
            <span className="text-xs font-bold text-white tracking-widest uppercase">Gupta Studio</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-black via-zinc-900 to-[#D4AF37]/40 border border-[#D4AF37] flex items-center justify-center shadow-lg shadow-black">
            {/* Elegant Golden Camera Logo */}
            <svg id="official-logo-svg" className="w-6 h-6 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 17V9C4 7.89543 4.89543 7 6 7H9L11 5H13L15 7H18C19.1046 7 20 7.89543 20 9V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="1" fill="currentColor"/>
              <path d="M12 2C16.5 2 20 4.5 20 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <nav id="sticky-nav" className="sticky top-0 w-full bg-black/80 backdrop-blur-xl z-40 border-b border-[#D4AF37]/20 shadow-lg shadow-black/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-14">
            <ul className="flex items-center gap-1 sm:gap-6 md:gap-10 overflow-x-auto no-scrollbar py-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    id={`nav-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-3 py-2 text-xs sm:text-sm font-light tracking-[0.18em] uppercase transition-all duration-300 ${
                      activeTab === item.id
                        ? 'text-[#D4AF37] font-medium drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                        : 'text-zinc-400 hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]'
                    }`}
                  >
                    {item.label}
                    {activeTab === item.id && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
