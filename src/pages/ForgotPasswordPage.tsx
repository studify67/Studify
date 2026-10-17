import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { accountService } from '../services/accountService';

interface ForgotPasswordPageProps {
  onNavigateToLogin: (prefilledEmail?: string) => void;
  onNavigateToHome?: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateToLogin,
  onNavigateToHome,
}) => {
  const [step, setStep] = useState<'request' | 'set_new_password' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    if (!accountService.accountExists(trimmedEmail)) {
      setErrorMessage('No registered account was found with this email. Please check your spelling or sign up.');
      return;
    }

    // Advance directly to password update step
    setStep('set_new_password');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-type your new password.');
      return;
    }

    setIsLoading(true);
    try {
      accountService.resetPassword(email.trim(), newPassword);
      setStep('success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm">
        <button
          onClick={() => (onNavigateToHome ? onNavigateToHome() : onNavigateToLogin())}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to log in</span>
        </button>

        <div className="bg-[#0e0e11] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl">
          {step === 'request' && (
            <>
              <div className="mb-6 space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  Reset password
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Enter your email address to reset your Studify password.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-medium text-neutral-300 mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161a] border border-white/[0.1] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-semibold rounded-xl transition-all"
                >
                  Continue
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                <button
                  type="button"
                  onClick={() => onNavigateToLogin()}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Remember your password? Log in
                </button>
              </div>
            </>
          )}

          {step === 'set_new_password' && (
            <>
              <div className="mb-6 space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  Set new password
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Enter a new password for <span className="text-white font-medium">{email}</span>.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-xs font-medium text-neutral-300 mb-1.5"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      disabled={isLoading}
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-[#16161a] border border-white/[0.1] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-xs font-medium text-neutral-300 mb-1.5"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    disabled={isLoading}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#16161a] border border-white/[0.1] rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    'Save new password'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Change email address
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-white">
                  Password updated
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-xs mx-auto">
                  Your password has been reset successfully. You can now log in with your new credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToLogin(email)}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-semibold rounded-xl transition-all mt-4"
              >
                Sign in to your account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
