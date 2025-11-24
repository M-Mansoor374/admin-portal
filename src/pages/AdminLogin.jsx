import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { HiShieldCheck, HiLockClosed } from 'react-icons/hi';

const inputBaseClasses =
  'w-full rounded-[16px] sm:rounded-[18px] md:rounded-[20px] lg:rounded-[22px] bg-white/95 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-700 shadow-lg shadow-purple-900/5 outline-none transition focus:shadow-purple-500/25 focus:ring-0 placeholder:text-sm sm:placeholder:text-base';

const AdminLoginComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Get the redirect path from location state (if user was redirected here)
  const from = location.state?.from?.pathname || '/admin';

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const isDisabled = useMemo(
    () => isSubmitting || credentials.username.trim() === '' || credentials.password.trim() === '',
    [credentials.password, credentials.username, isSubmitting],
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setError('');
      if (isDisabled) {
        setError('Please enter both username and password.');
        return;
      }
      
      setIsSubmitting(true);
      
      // Admin login authentication
      // TODO: Replace with proper backend authentication in production
      window.setTimeout(() => {
        sessionStorage.setItem('acceptopia-admin-authenticated', 'true');
        sessionStorage.setItem('acceptopia-admin-role', 'admin');
        setIsSubmitting(false);
        // Redirect to admin dashboard
        navigate(from, { replace: true });
      }, 700);
    },
    [isDisabled, navigate, from, credentials],
  );

  useEffect(() => {
    if (sessionStorage.getItem('acceptopia-admin-authenticated') === 'true') {
      // If already authenticated, redirect to admin dashboard
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <main className="flex flex-1 flex-col">
        <section className="relative flex flex-1 items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(147,51,234,0.18),transparent_55%)]" />

          <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl [perspective:1600px]">
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500/40 via-transparent to-indigo-500/40 blur-3xl" aria-hidden="true" />
            <div className="relative flex min-h-0 flex-col justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 rounded-2xl sm:rounded-3xl md:rounded-[34px] bg-gradient-to-br from-indigo-500/70 via-purple-500/60 to-pink-500/70 p-[1px] shadow-2xl shadow-purple-500/70 transition-all duration-700 ease-out">
              <div className="pointer-events-none absolute -top-12 right-12 hidden h-28 w-28 rounded-full bg-purple-400/60 blur-3xl md:block" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-14 left-10 hidden h-32 w-32 rounded-full bg-indigo-500/50 blur-[120px] md:block" aria-hidden="true" />
              <div className="relative flex min-h-0 flex-col justify-between gap-4 sm:gap-5 md:gap-7 lg:gap-8 rounded-2xl sm:rounded-3xl md:rounded-[32px] border border-white/20 bg-slate-900/90 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-14 backdrop-blur-xl transition-all duration-500 ease-out">
                
                {/* Header */}
                <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
                    <HiShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Admin Portal</h1>
                    <p className="text-xs sm:text-sm text-slate-400">Secure Administrator Access</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.35em] text-white shadow-lg shadow-purple-500/25">
                    <HiLockClosed className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    Restricted Area
                  </span>
                </div>
                
                {/* Login Form */}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 rounded-xl sm:rounded-2xl md:rounded-3xl border border-indigo-500/30 bg-slate-800/50 p-4 sm:p-5 md:p-6 lg:p-8 shadow-inner shadow-purple-900/60 backdrop-blur"
                >
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-300" htmlFor="username">
                      Administrator Username
                    </label>
                    <div className="rounded-[18px] sm:rounded-[20px] md:rounded-[24px] lg:rounded-[26px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-inner shadow-indigo-500/40">
                      <input
                        id="username"
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        autoComplete="username"
                        className={inputBaseClasses}
                        placeholder="Enter admin username"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-300" htmlFor="password">
                      Administrator Password
                    </label>
                    <div className="rounded-[18px] sm:rounded-[20px] md:rounded-[24px] lg:rounded-[26px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[1px] shadow-inner shadow-purple-500/40">
                      <div className="relative flex items-center rounded-[16px] sm:rounded-[18px] md:rounded-[22px] lg:rounded-[24px] bg-white/95">
                        <input
                          id="password"
                          type={isPasswordVisible ? 'text' : 'password'}
                          name="password"
                          value={credentials.password}
                          onChange={handleChange}
                          autoComplete="current-password"
                          className={`${inputBaseClasses} pr-11 sm:pr-12`}
                          placeholder="Enter admin password"
                          aria-label="Password"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                          aria-pressed={isPasswordVisible}
                          className="absolute right-2 sm:right-3 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-transparent text-slate-400 transition hover:text-slate-600 active:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
                        >
                          {isPasswordVisible ? (
                            <IoEyeOffOutline className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <IoEyeOutline className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <p className="rounded-lg sm:rounded-xl md:rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] sm:text-xs font-semibold text-rose-500 break-words">
                      {error}
                    </p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-purple-400/40 focus-visible:outline-purple-400 min-h-[44px] touch-manipulation"
                  >
                    {isSubmitting ? (
                      'Authenticating…'
                    ) : (
                      <>
                        <HiShieldCheck className="w-4 h-4" />
                        Secure Admin Login
                      </>
                    )}
                  </button>
                </form>
                
                {/* Footer */}
                <div className="flex flex-col items-center gap-2.5 sm:gap-3 md:gap-4">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-indigo-500/40 bg-slate-800/70 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-slate-400 shadow-sm shadow-purple-500/30 backdrop-blur">
                    <span className="hidden xs:inline">Encrypted connection</span>
                    <span className="inline xs:hidden">Secure</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 animate-pulse" />
                    <span className="hidden xs:inline">Secure</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 text-center px-3 sm:px-4 leading-relaxed">
                    Authorized personnel only. All access is monitored and logged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export const AdminLogin = memo(AdminLoginComponent);
export default AdminLogin;

