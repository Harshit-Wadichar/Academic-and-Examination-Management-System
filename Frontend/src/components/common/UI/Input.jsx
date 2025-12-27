import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  containerClassName = '',
  id,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
  const isError = Boolean(error);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          className={`
            w-full bg-white dark:bg-slate-800 
            text-slate-900 dark:text-white 
            placeholder-slate-400 dark:placeholder-slate-500
            border-2 rounded-xl py-2.5 
            ${Icon ? 'pl-10' : 'pl-4'} pr-4
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-primary-500/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
              : 'border-slate-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-primary-500 hover:border-slate-300 dark:hover:border-slate-600'
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {isError && (
        <p className="mt-1.5 ml-1 text-sm text-red-500 flex items-center animate-fade-in">
          <span className="w-1 h-1 bg-red-500 rounded-full mr-2 inline-block"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
