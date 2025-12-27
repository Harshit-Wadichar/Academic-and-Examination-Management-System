import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '', 
  variant = 'default',
  hover = false,
  noPadding = false,
  footer,
  action,
  animated = false,
  ...props 
}) => {
  
  const variants = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-premium',
    glass: 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-glass',
    outline: 'bg-transparent border-2 border-slate-200 dark:border-slate-700',
    flat: 'bg-slate-50 dark:bg-slate-800/50'
  };

  const hoverClasses = hover ? 'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300' : '';
  const paddingClasses = noPadding ? '' : 'p-6';

  return (
    <motion.div 
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4 }}
      className={`rounded-3xl overflow-hidden ${variants[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className={`px-6 py-5 border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-start ${noPadding ? '' : 'mb-0'}`}>
          <div>
            {title && <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      
      <div className={paddingClasses}>
        {children}
      </div>

      {footer && (
        <div className="bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 border-t border-gray-100 dark:border-slate-700/50">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;