import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, User, Feather } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const initialRoleParam = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState(
    initialRoleParam === 'author' ? 'author' : 'reader'
  );

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'author' || roleParam === 'reader') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newTouched = {
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(newTouched);

    const nameErr = validateField('name');
    const emailErr = validateField('email');
    const passErr = validateField('password');
    const confirmErr = validateField('confirmPassword');

    const newErrors = {
      name: nameErr,
      email: emailErr,
      password: passErr,
      confirmPassword: confirmErr
    };
    setErrors(newErrors);

    if (nameErr || emailErr || passErr || confirmErr) {
      return;
    }

    setIsLoading(true);

    try {
      const user = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        selectedRole
      );

      setIsLoading(false);

      if (user?.role === 'author' || selectedRole === 'author') {
        navigate('/author/dashboard', { replace: true });
      } else {
        navigate('/my-shelf', { replace: true });
      }
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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FAF8F6] py-16 px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F4EEEA] border border-[#E7D9D3] flex items-center justify-center text-[#2B2B2B] mx-auto">
            <BookOpen className="w-6 h-6 text-[#D3968C]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block">
            Join BookVerse Studio
          </span>
          <h1 className="font-editorial-serif text-4xl text-[#2B2B2B] font-normal">
            Create Your Account
          </h1>
          <p className="text-xs text-[#6E6A67]">
            {selectedRole === 'reader'
              ? 'Start building your personal digital library.'
              : 'Publish your manuscripts through our Writing Studio.'}
          </p>
        </div>

        {/* Auth Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#E7D9D3] shadow-sm space-y-8"
        >
          {/* Reader / Author Role Switcher */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase font-mono tracking-widest text-[#6E6A67] block text-center font-semibold">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#F4EEEA] border border-[#E7D9D3]">
              <button
                type="button"
                onClick={() => handleRoleChange('reader')}
                className={`py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'reader'
                    ? 'bg-[#FFFFFF] text-[#2B2B2B] font-semibold shadow-sm border border-[#E7D9D3]'
                    : 'text-[#6E6A67] hover:text-[#2B2B2B]'
                }`}
              >
                <User className="w-4 h-4 text-[#D3968C]" />
                <span>Reader</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('author')}
                className={`py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  selectedRole === 'author'
                    ? 'bg-[#FFFFFF] text-[#2B2B2B] font-semibold shadow-sm border border-[#E7D9D3]'
                    : 'text-[#6E6A67] hover:text-[#2B2B2B]'
                }`}
              >
                <Feather className="w-4 h-4 text-[#D3968C]" />
                <span>Author</span>
              </button>
            </div>
          </div>

          {/* Duplicate Email or Server Banner */}
          {serverError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center font-mono">
              {serverError}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center"
              icon={ArrowRight}
            >
              {isLoading
                ? 'Creating Account…'
                : `Create ${selectedRole === 'author' ? 'Author' : 'Reader'} Account`}
            </Button>
          </form>

          {/* Footer Terms & Navigation */}
          <div className="pt-4 border-t border-[#E7D9D3] text-center space-y-3">
            <p className="text-xs text-[#6E6A67]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#2B2B2B] font-semibold hover:text-[#D3968C] underline"
              >
                Sign In
              </Link>
            </p>
            <p className="text-[11px] font-mono text-[#6E6A67]/80">
              By creating an account, you agree to our editorial and publishing guidelines.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
