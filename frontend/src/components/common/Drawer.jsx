import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Drawer({ isOpen, onClose, title, children, position = 'right' }) {
  const isRight = position === 'right';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#2B2B2B]/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, x: isRight ? '100%' : '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRight ? '100%' : '-100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#FAF8F6] h-full shadow-2xl p-8 border-l border-[#E7D9D3] flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E7D9D3] pb-4">
                <h3 className="font-editorial-serif text-2xl font-bold text-[#2B2B2B]">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[#F4EEEA] text-[#6E6A67] hover:text-[#2B2B2B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div>{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
