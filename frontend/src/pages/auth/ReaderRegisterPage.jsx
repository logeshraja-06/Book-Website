import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'Germany',
  'United Arab Emirates',
  'Other'
];

export default function ReaderRegisterPage() {
  const navigate = useNavigate();
  const { registerReader } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'India',
    acceptTerms: false
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate Password Strength (0 to 100%)
  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 30;
    if (pass.length >= 12) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;
    return Math.min(100, score);
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getStrengthLabel = (score) => {
    if (score === 0) return '';
    if (score < 40) return 'Weak';
    if (score < 70) return 'Moderate';
    return 'Strong';
  };

  const getStrengthColor = (score) => {
    if (score < 40) return 'bg-red-400';
    if (score < 70) return 'bg-amber-400';
    return 'bg-emerald-500';
  };

  const validateField = (field, values = formData) => {
    let err = '';

    if (field === 'name') {
      if (!values.name.trim()) err = 'Full name is required.';
    }

    if (field === 'email') {
      if (!values.email.trim()) {
        err = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        err = 'Enter a valid email address.';
      }
    }

    if (field === 'password') {
      if (!values.password) {
        err = 'Password is required.';
      } else if (values.password.length < 8) {
        err = 'Password must be at least 8 characters.';
      }
    }

    if (field === 'confirmPassword') {
      if (!values.confirmPassword) {
        err = 'Please confirm your password.';
      } else if (values.confirmPassword !== values.password) {
        err = 'Passwords do not match.';
      }
    }

    if (field === 'acceptTerms') {
      if (!values.acceptTerms) {
        err = 'You must accept the terms to create an account.';
      }
    }

    return err;
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setServerError('');

    if (touched[field]) {
      const err = validateField(field, updated);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }

    if (field === 'password' && touched.confirmPassword) {
      const confirmErr = validateField('confirmPassword', updated);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newTouched = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true
    };
    setTouched(newTouched);

    const nameErr = validateField('name');
    const emailErr = validateField('email');
    const passErr = validateField('password');
    const confirmErr = validateField('confirmPassword');
    const termsErr = validateField('acceptTerms');

    setErrors({
      name: nameErr,
      email: emailErr,
      password: passErr,
      confirmPassword: confirmErr,
      acceptTerms: termsErr
    });

    if (nameErr || emailErr || passErr || confirmErr || termsErr) {
      return;
    }

    setIsLoading(true);

    try {
      await registerReader({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        country: formData.country
      });

      setIsLoading(false);
      navigate('/login?registered=reader', { replace: true });
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || '';
      if (msg.includes('already exists') || msg.includes('409')) {
        setServerError('An account with this email already exists. Try signing in instead.');
      } else {
        setServerError(msg || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F5F5DA] py-16 px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] flex items-center justify-center text-[#211D1D] mx-auto shadow-2xs">
            <User className="w-6 h-6 text-[#7B021D]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
            Reader Registration
          </span>
          <h1 className="font-editorial-serif text-4xl text-[#211D1D] font-normal">
            Create Reader Account
          </h1>
          <p className="text-xs text-[#6B5E5E]">
            Start building your personal digital shelf and discover timeless literature.
          </p>
        </div>

        {/* Auth Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FFFDF3] rounded-3xl p-8 sm:p-10 border border-[#E9E5C8] shadow-sm space-y-6"
        >
          {serverError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-mono">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Full Name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={touched.name ? errors.name : ''}
              placeholder="e.g. Ananya Sharma"
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : ''}
              placeholder="e.g. ananya@bookverse.in"
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : ''}
                placeholder="Min. 8 characters"
              />

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#6B5E5E]">
                    <span>Password Strength:</span>
                    <span className="font-semibold">{getStrengthLabel(passwordStrength)}</span>
                  </div>
                  <div className="w-full h-1 bg-[#F5F5DA] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              placeholder="Re-enter your password"
            />

            <Input
              label="Country"
              type="select"
              options={COUNTRIES}
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />

            <div className="space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-mono text-[#6B5E5E]">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                  className="mt-0.5 rounded border-[#E9E5C8] text-[#7B021D] focus:ring-[#7B021D]"
                />
                <span>
                  I accept the BookVerse Studio Terms of Service & Privacy Policy.
                </span>
              </label>
              {touched.acceptTerms && errors.acceptTerms && (
                <p className="text-[11px] font-mono text-[#7B021D] font-medium">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center mt-2 bg-[#7B021D] text-[#F5F5DA] hover:bg-[#520014]"
              icon={ArrowRight}
            >
              {isLoading ? 'Creating Reader Account…' : 'Create Reader Account'}
            </Button>
          </form>

          <div className="pt-4 border-t border-[#E9E5C8] text-center text-xs font-mono text-[#6B5E5E]">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-[#211D1D] font-bold hover:text-[#7B021D] underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
