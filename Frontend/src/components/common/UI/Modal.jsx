import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
          onClick={onClose}
        ></div>
        
        {/* Modal Content */}
        <div className={`relative z-[10000] w-full ${sizes[size]} p-6 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-slate-700`}>
          <div className="flex items-center justify-between mb-4">
            {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
            {children}
          </div>
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(156, 163, 175, 0.5);
              border-radius: 20px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(107, 114, 128, 0.8);
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(71, 85, 105, 0.5);
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(100, 116, 139, 0.8);
            }
          `}</style>
        </div>
      </div>
    </div>
  );

  // Use Portal to render modal at document body level
  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;