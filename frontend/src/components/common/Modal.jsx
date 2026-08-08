import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative w-full ${maxWidth} bg-[#FFFDF3] rounded-3xl p-6 sm:p-8 border border-[#E9E5C8] shadow-2xl space-y-6 text-[#211D1D] overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E9E5C8] pb-4">
              <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#F5F5DA] text-[#6B5E5E] hover:text-[#211D1D] transition-colors"
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
