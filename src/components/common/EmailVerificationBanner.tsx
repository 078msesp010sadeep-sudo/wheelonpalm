import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EmailVerificationBanner: React.FC = () => {
  const { user, sendVerificationEmail } = useAuth();
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user || user.isEmailVerified) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendVerificationEmail();
      setIsSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-900 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Verify your email:</strong> A verification link was sent to{' '}
            <span className="font-semibold">{user.email}</span>. Please verify your address to enable all vehicle ownership actions.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isSent ? (
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Link sent!
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-xs font-semibold text-amber-900 underline hover:text-amber-800 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Resend verification link'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
