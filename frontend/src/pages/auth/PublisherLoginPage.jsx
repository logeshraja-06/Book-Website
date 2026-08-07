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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FAF8F6] py-16 px-6">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2B2B2B] text-[#FAF8F6] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-6 h-6 text-[#D3968C]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#D3968C] font-semibold block">
            Internal Editorial Desk
          </span>
          <h1 className="font-editorial-serif text-3xl text-[#2B2B2B] font-bold">
            Publisher Control Center
          </h1>
          <p className="text-xs text-[#6E6A67]">
            Restricted internal access point for catalog registrars & chief editorial staff.
          </p>
        </div>

        {/* Auth Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#E7D9D3] shadow-md space-y-6"
        >
          <div className="p-3.5 rounded-2xl bg-[#F4EEEA] border border-[#E7D9D3] text-xs font-mono text-[#6E6A67] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D3968C] shrink-0" />
            <span>Authorized Editorial Personnel Only</span>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center font-mono">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Publisher Credentials (Email)"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Security Clearance Key"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center"
              icon={ArrowRight}
            >
              {isLoading ? 'Verifying Credentials…' : 'Access Publisher Workspace'}
            </Button>
          </form>

          <div className="pt-2 text-center text-[11px] font-mono text-[#6E6A67]">
            BookVerse Publishing & Distribution Infrastructure v2.4
          </div>
        </motion.div>
      </div>
    </div>
  );
}
