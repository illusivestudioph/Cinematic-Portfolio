import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminDashboard } from './AdminDashboard';
import { signInWithGoogle, isAuthorizedEmail, isSupabaseConfigured } from '../../lib/supabase';
import { Shield, X, AlertTriangle, ArrowRight } from 'lucide-react';

export const AdminGateModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAuthenticatedAdmin,
    setIsAuthenticatedAdmin,
  } = usePortfolio();


  const [authError, setAuthError] = useState<string | null>(null);
  const [devEmailInput, setDevEmailInput] = useState('');

  if (!isAdminOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      if (!isSupabaseConfigured) {
        setAuthError('Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set. You can use the authorized email verify below for direct access.');
        return;
      }
      await signInWithGoogle();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Google OAuth sign-in failed');
    }
  };

  const handleDirectAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthorizedEmail(devEmailInput)) {
      setIsAuthenticatedAdmin(true);
      setAuthError(null);
    } else {
      setAuthError(`ACCESS DENIED: "${devEmailInput}" is not an authorized editor for ILLUSIVE STUDIO.`);
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
          /* Authentication Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)] mb-6">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>

            <h2 className="font-syne text-2xl font-bold text-white uppercase tracking-wider">
              ILLUSIVE STUDIO // ADMIN GATE
            </h2>

            <p className="mt-2 text-xs font-mono text-slate-400 leading-relaxed">
              Restricted management portal for portfolio media assets, WebP sequences, and editorial projects.
            </p>

            <div className="my-6 p-3 rounded-lg bg-black/60 border border-white/10 w-full text-left font-mono text-xs">
              <span className="text-slate-500 block text-[10px] uppercase">Authorized Studio Account:</span>
              <span className="text-cyan-400 font-bold">yhanlhester@gmail.com</span>
            </div>

            {/* Error Message if unauthorized */}
            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-start space-x-2 text-left w-full">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Google OAuth Login Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-3 hover:bg-slate-200 transition-colors shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.54 0 2.89.55 3.96 1.45l2.97-2.97C17.13 1.83 14.73 1 12 1 7.37 1 3.4 3.73 1.5 7.64l3.66 2.84C6.03 7.55 8.76 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.28c0-.82-.07-1.61-.2-2.28H12v4.56h6.47c-.28 1.48-1.12 2.74-2.38 3.59l3.68 2.85c2.15-1.99 3.4-4.91 3.4-8.72z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.16 14.64C4.94 13.97 4.82 13.25 4.82 12.5s.12-1.47.34-2.14L1.5 7.64C.55 9.53 0 11.66 0 12.5s.55 2.97 1.5 4.86l3.66-2.72z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.68-2.85c-1.07.72-2.45 1.16-4.26 1.16-3.24 0-5.97-2.15-6.84-5.48L1.5 16.5C3.4 20.27 7.37 24 12 24z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Direct Authorized Verification */}
            <div className="relative my-6 w-full flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-[#090b10] text-[10px] font-mono uppercase text-slate-500">
                OR DIRECT VERIFICATION
              </span>
            </div>

            <form onSubmit={handleDirectAuth} className="w-full space-y-3">
              <input
                type="email"
                placeholder="Enter authorized email address"
                value={devEmailInput}
                onChange={(e) => setDevEmailInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-white/15 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
              >
                <span>Verify Access Gate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
