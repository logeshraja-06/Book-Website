import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2B2B2B]/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative w-full ${maxWidth} bg-[#FAF8F6] rounded-3xl p-6 sm:p-8 border border-[#E7D9D3] shadow-2xl space-y-6 text-[#2B2B2B] overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-4">
              <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B]">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#F4EEEA] text-[#6E6A67] hover:text-[#2B2B2B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
