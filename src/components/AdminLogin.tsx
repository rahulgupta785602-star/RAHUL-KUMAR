import React, { useState } from 'react';
import { Shield, Lock, User, X, AlertTriangle } from 'lucide-react';

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onClose, onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'rahulgupta@123' && password === 'Raghul@123') {
      setIsLoggingIn(true);
      setTimeout(() => {
        setIsLoggingIn(false);
        onLoginSuccess();
        onClose();
      }, 1000);
    } else {
      setError('Invalid admin credentials. Access Denied.');
    }
  };

  return (
    <div id="admin-login-modal" className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-zinc-950 border border-[#D4AF37] p-8 max-w-sm w-full relative rounded-none shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-[#D4AF37] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#D4AF37] mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] font-semibold block">
            Security Gateway
          </span>
          <h3 className="text-lg text-white font-light uppercase tracking-widest mt-1">
            Admin Access Only
          </h3>
        </div>

        {/* Error Alert */}
        {error && (
          <div id="admin-login-error" className="mb-4 p-3 bg-red-950/40 border border-red-900 text-red-400 text-xs tracking-wider uppercase flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <User className="w-3.5 h-3.5" />
              </span>
              <input
                id="admin-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rahulgupta@123"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 pl-9 pr-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Raghul@123"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-none py-2.5 pl-9 pr-3 text-xs tracking-wider focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            id="btn-admin-login-submit"
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-[#D4AF37] hover:bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-none transition-all duration-300 mt-6"
          >
            {isLoggingIn ? 'Verifying Gateway...' : 'Access Console'}
          </button>
        </form>

        <div className="text-center mt-6 text-[10px] text-zinc-600 uppercase tracking-wider">
          Gupta Photo Studio Security Protocol
        </div>
      </div>
    </div>
  );
}
