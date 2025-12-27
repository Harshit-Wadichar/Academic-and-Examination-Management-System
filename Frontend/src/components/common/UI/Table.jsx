import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileX } from 'lucide-react';

const Table = ({ columns, data, loading = false, onRowClick }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${index === 0 ? 'rounded-tl-2xl' : ''} ${index === columns.length - 1 ? 'rounded-tr-2xl' : ''}`}
                >
                  {column.label || column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white/50 dark:bg-transparent">
            {loading ? (
                // Skeleton Rows handling
               [...Array(5)].map((_, i) => (
                 <tr key={i}>
                   {columns.map((_, colIndex) => (
                     <td key={colIndex} className="px-6 py-4">
                       <div className="h-10 bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse w-full"></div>
                     </td>
                   ))}
                 </tr>
               ))
            ) : (
                <AnimatePresence>
                {data.map((row, index) => (
                    <motion.tr
                    key={row.id || index}
                    // Removed initial opacity:0 to prevent "white flash" after skeleton
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`group transition-colors duration-200 ${
                        onRowClick ? 'cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                    >
                    {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </td>
                    ))}
                    </motion.tr>
                ))}
                </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
      
      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
             <FileX size={32} className="text-slate-400" />
          </div>
          <p className="font-medium">No data available</p>
        </div>
      )}
    </div>
  );
};

export default Table;