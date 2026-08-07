import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, User, Feather } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, DEFAULT_USERS } = useAuth();

  const [selectedRole, setSelectedRole] = useState('reader');
  const [email, setEmail] = useState(DEFAULT_USERS.reader.email);
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (DEFAULT_USERS[role]) {
      setEmail(DEFAULT_USERS[role].email);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(selectedRole, email);
      setIsLoading(false);

      if (from && !from.startsWith('/publisher')) {
        navigate(from, { replace: true });
        return;
      }

      if (selectedRole === 'author') {
        navigate('/author/dashboard', { replace: true });
      } else {
        navigate('/my-shelf', { replace: true });
      }
    }, 400);
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
            BookVerse Sign In
          </span>
          <h1 className="font-editorial-serif text-4xl text-[#2B2B2B] font-normal">
            Welcome to BookVerse
          </h1>
          <p className="text-xs text-[#6E6A67]">
            Sign in to access your personal bookshelf or manage your published titles.
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Target Destination Hint */}
            <div className="p-3 rounded-xl bg-[#F4EEEA]/60 border border-[#E7D9D3] text-[11px] font-mono text-[#6E6A67] flex items-center justify-between">
              <span>Landing Page:</span>
              <span className="font-semibold text-[#2B2B2B]">
                {selectedRole === 'reader' ? '/my-shelf' : '/author/dashboard'}
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full"
              icon={ArrowRight}
            >
              {isLoading ? 'Signing In…' : `Sign In as ${selectedRole.toUpperCase()}`}
            </Button>
          </form>

          {/* Registration Links */}
          <div className="pt-4 border-t border-[#E7D9D3] text-center space-y-2 text-xs font-mono text-[#6E6A67]">
            <p>
              New reader?{' '}
              <button
                type="button"
                onClick={() => {
                  login('reader', 'newreader@bookverse.in', 'New Reader');
                  navigate('/my-shelf');
                }}
                className="text-[#2B2B2B] font-semibold hover:text-[#D3968C] underline"
              >
                Create a Reader Account
              </button>
            </p>
            <p>
              Want to publish?{' '}
              <button
                type="button"
                onClick={() => {
                  login('author', 'newauthor@bookverse.in', 'New Author');
                  navigate('/author/dashboard');
                }}
                className="text-[#2B2B2B] font-semibold hover:text-[#D3968C] underline"
              >
                Become an Author
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
