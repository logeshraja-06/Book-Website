import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const emailInputRef = useRef(null);

  const [email, setEmail] = useState(() => localStorage.getItem('bookverse_remembered_email') || 'ananya@bookverse.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const registeredParam = searchParams.get('registered');
  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (registeredParam) {
      setToastMessage(`✓ Account created successfully! Please sign in.`);
      setTimeout(() => setToastMessage(''), 4000);
    }
  }, [registeredParam]);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setToastMessage('ℹ Password reset service available. Contact editorial support.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setToastMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('bookverse_remembered_email', email.trim());
      } else {
        localStorage.removeItem('bookverse_remembered_email');
      }

      const user = await login(email.trim(), password);
      setIsLoading(false);

      if (from && !from.startsWith('/publisher')) {
        navigate(from, { replace: true });
        return;
      }

      // Role Auto-Detection Redirect
      if (user.role === 'author') {
        navigate('/author/dashboard', { replace: true });
      } else if (user.role === 'publisher' || user.role === 'admin') {
        navigate('/publisher', { replace: true });
      } else {
        navigate('/my-shelf', { replace: true });
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Invalid email or password. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F5F5DA] py-16 px-6 relative">
      {/* Success / Notification Toast Banner */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#211D1D] text-[#F5F5DA] shadow-xl border border-[#E9E5C8]/20 flex items-center gap-3 text-xs font-mono"
        >
          <CheckCircle2 className="w-4 h-4 text-[#7B021D]" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#211D1D] mx-auto shadow-2xs">
            <BookOpen className="w-6 h-6 text-[#7B021D]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
            BookVerse Sign In
          </span>
          <h1 className="font-editorial-serif text-4xl text-[#211D1D] font-normal">
            Welcome to BookVerse
          </h1>
          <p className="text-xs text-[#6B5E5E]">
            Sign in to access your personal digital shelf or manage your manuscripts.
          </p>
        </div>

        {/* Auth Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FFFDF3] rounded-3xl p-8 sm:p-10 border border-[#E9E5C8] shadow-sm space-y-8"
        >
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-mono">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              ref={emailInputRef}
              label="Email Address"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya@bookverse.in"
            />

            <div className="space-y-1.5 relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-8 text-[#6B5E5E] hover:text-[#211D1D] p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#6B5E5E]" />
                ) : (
                  <Eye className="w-4 h-4 text-[#6B5E5E]" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs font-mono text-[#6B5E5E] pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E9E5C8] text-[#7B021D] focus:ring-[#7B021D] w-3.5 h-3.5"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#6B5E5E] hover:text-[#7B021D] underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center bg-[#7B021D] text-[#F5F5DA] hover:bg-[#520014]"
              icon={ArrowRight}
            >
              {isLoading ? 'Signing In…' : 'Sign In'}
            </Button>
          </form>

          {/* Dedicated Registration Links */}
          <div className="pt-4 border-t border-[#E9E5C8] text-center space-y-2 text-xs font-mono text-[#6B5E5E]">
            <p>
              New reader?{' '}
              <Link
                to="/register/reader"
                className="text-[#211D1D] font-bold hover:text-[#7B021D] underline"
              >
                Create a Reader Account
              </Link>
            </p>
            <p>
              Want to publish?{' '}
              <Link
                to="/register/author"
                className="text-[#211D1D] font-bold hover:text-[#7B021D] underline"
              >
                Become an Author
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
