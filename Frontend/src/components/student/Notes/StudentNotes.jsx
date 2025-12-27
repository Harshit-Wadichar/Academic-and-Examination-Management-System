import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, BookOpen } from 'lucide-react';
import { useApi } from '../../../hooks/useApi';
import Card from '../../common/UI/Card';
import Button from '../../common/UI/Button';

const StudentNotes = () => {
  const { data: notesData, loading, error } = useApi('/notes');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (notesData?.data) {
      setFilteredNotes(notesData.data);
    }
  }, [notesData]);

  useEffect(() => {
    if (notesData?.data) {
      const filtered = notesData.data.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notesData]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center mb-3">
             <BookOpen className="mr-3 text-indigo-500" size={32} />
             Study Material
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
             Access course notes and resources for your semester
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
           <input 
             type="text" 
             placeholder="Search by title or course..." 
             className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-indigo-500 focus:ring-0 transition-all shadow-sm group-hover:shadow-md"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
           <div className="w-24 h-24 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={48} className="text-slate-300 dark:text-slate-600" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No notes found</h3>
           <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
             It seems there are no materials uploaded for your course and semester yet.
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
              <div className="p-6 h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-5">
                    <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <FileText size={28} />
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600/50">
                        {note.course} • Sem {note.semester}
                    </span>
                    </div>
                    
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={note.title}>
                    {note.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6 space-x-2">
                    <span className="font-medium bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{note.department}</span>
                    <span className="text-slate-300">•</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <a 
                   href={note.fileUrl}
                   target="_blank"
                   rel="noreferrer"
                   className="flex items-center justify-center w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all shadow-lg shadow-slate-200 dark:shadow-none group-hover:shadow-indigo-500/25"
                >
                   <Download size={20} className="mr-2" />
                   Download PDF
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotes;
