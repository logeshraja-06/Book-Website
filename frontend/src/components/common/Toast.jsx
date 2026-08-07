import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export default function Toast({ isOpen, message, type = 'success', onClose }) {
  const iconMap = {
    success: CheckCircle2,
    info: Info,
    warning: AlertCircle,
  };

  const Icon = iconMap[type] || CheckCircle2;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#E8C8C2]/30 border border-[#E7D9D3] backdrop-blur-md shadow-lg flex items-center gap-3 text-xs font-mono text-[#2B2B2B] max-w-sm"
        >
          <Icon className="w-5 h-5 text-[#D3968C] shrink-0" />
          <span className="flex-1">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-[#6E6A67] hover:text-[#2B2B2B] ml-2 font-bold"
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
