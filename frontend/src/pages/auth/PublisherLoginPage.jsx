import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function PublisherLoginPage() {
  const navigate = useNavigate();
  const { login, DEFAULT_USERS } = useAuth();

  const [email, setEmail] = useState(DEFAULT_USERS.publisher.email);
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(email.trim(), password);
      setIsLoading(false);
      navigate('/publisher', { replace: true });
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F5F5DA] py-16 px-6">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFDF3] border border-[#E9E5C8] text-[#211D1D] flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-[#7B021D]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block">
            Internal Editorial Desk
          </span>
          <h1 className="font-editorial-serif text-3xl text-[#211D1D] font-bold">
            Publisher Control Center
          </h1>
          <p className="text-xs text-[#6B5E5E]">
            Restricted internal access point for catalog registrars & chief editorial staff.
          </p>
        </div>

        {/* Auth Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FFFDF3] rounded-3xl p-8 sm:p-10 border border-[#E9E5C8] shadow-sm space-y-6"
        >
          <div className="p-3.5 rounded-2xl bg-[#F5F5DA] border border-[#E9E5C8] text-xs font-mono text-[#6B5E5E] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#7B021D] shrink-0" />
            <span>Authorized credentials preloaded for quick evaluation.</span>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-mono">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Editorial Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. publisher@bookverse.in"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center bg-[#7B021D] text-[#F5F5DA] hover:bg-[#520014]"
              icon={ArrowRight}
            >
              {isLoading ? 'Verifying Desk…' : 'Enter Workspace'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
