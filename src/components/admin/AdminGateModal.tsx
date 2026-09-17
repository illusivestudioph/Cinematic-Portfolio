import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminDashboard } from './AdminDashboard';
import { Shield, X, AlertTriangle, KeyRound, ArrowRight, Lock } from 'lucide-react';

const ADMIN_PASSKEY = 'Satanas666';

export const AdminGateModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAuthenticatedAdmin,
    setIsAuthenticatedAdmin,
    setUserEmail,
  } = usePortfolio();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!isAdminOpen) return null;

  const handlePasswordAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSKEY) {
      sessionStorage.setItem('illusive_admin_auth', 'true');
      setIsAuthenticatedAdmin(true);
      setUserEmail('Admin');
      setAuthError(null);
      setPasswordInput('');
    } else {
      setAuthError('INVALID PASSKEY. ACCESS DENIED.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[85vh] rounded-2xl bg-[#090b10] border border-cyan-500/30 shadow-[0_0_80px_rgba(56,189,248,0.2)] overflow-hidden flex flex-col">
        {/* Close Modal X Button */}
        <button
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Close Admin Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isAuthenticatedAdmin ? (
          <AdminDashboard onClose={() => setIsAdminOpen(false)} />
        ) : (
          /* Passkey Authentication Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)] mb-6">
              <KeyRound className="w-8 h-8 text-cyan-400" />
            </div>

            <h2 className="font-syne text-2xl font-bold text-white uppercase tracking-wider">
              ILLUSIVE STUDIO // PASSKEY GATE
            </h2>

            <p className="mt-2 text-xs font-mono text-slate-400 leading-relaxed">
              Enter the master studio passkey to unlock the CMS and media sequence controller.
            </p>

            {/* Error Message if unauthorized */}
            {authError && (
              <div className="my-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-start space-x-2 text-left w-full animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordAuth} className="w-full space-y-4 mt-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter studio passkey..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  autoFocus
                  className="w-full pl-10 pr-16 py-3 rounded-xl bg-black/70 border border-white/15 text-sm font-mono text-slate-200 focus:border-cyan-400 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-mono text-slate-400 hover:text-cyan-300"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:scale-[1.02]"
              >
                <span>Unlock Studio Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-8 flex items-center space-x-2 text-[10px] font-mono text-slate-500">
              <Shield className="w-3.5 h-3.5 text-cyan-400/60" />
              <span>SESSION PROTECTED // LOCAL ENCRYPTION</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
