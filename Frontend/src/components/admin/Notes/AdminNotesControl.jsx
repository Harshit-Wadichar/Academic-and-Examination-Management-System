import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useApi, useApiMutation } from '../../../hooks/useApi';
import Card from '../../common/UI/Card';
import Button from '../../common/UI/Button';
import { toast } from 'react-hot-toast';

const AdminNotesControl = () => {
  const [filter, setFilter] = useState('pending');
  // Pass the dynamic URL to the hook. It will automatically refetch when filter changes.
  const { data: notesData, loading: fetching, refetch } = useApi(`/notes?status=${filter}`);
  const { mutate, loading: acting } = useApiMutation();
  
  const notes = notesData?.data || [];

  const handleApprove = async (id) => {
    const result = await mutate('put', `/notes/${id}/approve`);
    if (result.success) {
      toast.success('Note approved!');
      refetch();
    }
  };

  const handleReject = async (id) => {
    const result = await mutate('put', `/notes/${id}/reject`);
    if (result.success) {
      toast.success('Note rejected');
      refetch();
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Notes Review
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and moderate teacher study materials
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm inline-flex">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize z-10 ${
                filter === status
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {filter === status && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
        {fetching ? (
           <div className="p-12 text-center">
             <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-slate-500">Loading notes...</p>
           </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-50 dark:bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              No {filter} notes found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              There are currently no notes in the {filter} list.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {notes.map((note) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout
                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Icon & Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {note.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {note.course}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{note.department}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>Sem {note.semester}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40 transition-colors"
                    >
                      <Search size={16} className="mr-2" />
                      View PDF
                    </a>

                    {note.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleApprove(note._id)}
                          loading={acting}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-200 dark:shadow-none"
                        >
                          <CheckCircle size={16} className="mr-1.5" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(note._id)}
                          loading={acting}
                          variant="secondary"
                          size="sm"
                          className="text-red-600 bg-white border border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:border-red-900/30"
                        >
                          <XCircle size={16} className="mr-1.5" />
                          Reject
                        </Button>
                      </>
                    )}

                    {note.status !== 'pending' && (
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                        note.status === 'approved' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                         {note.status === 'approved' ? (
                           <CheckCircle size={14} className="mr-1.5" />
                         ) : (
                           <XCircle size={14} className="mr-1.5" />
                         )}
                         <span className="capitalize">{note.status}</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
export default AdminNotesControl;
