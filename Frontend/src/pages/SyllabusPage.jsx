import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Upload, Eye, Download, Plus, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApi, useApiMutation } from '../hooks/useApi';
import Card from '../components/common/UI/Card';
import Button from '../components/common/UI/Button';
import Modal from '../components/common/UI/Modal';
import { toast } from 'react-hot-toast';

const SyllabusPage = () => {
  const { user } = useAuth();
  const { data: syllabuses, loading, refetch } = useApi('/syllabus');
  const { mutate, loading: uploading } = useApiMutation();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    description: '',
    content: ''
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    const result = await mutate('post', '/syllabus', formData);
    if (result.success) {
      toast.success('Syllabus uploaded successfully!');
      setShowUploadModal(false);
      setFormData({ title: '', course: '', description: '', content: '' });
      refetch();
    } else {
      toast.error('Failed to upload syllabus');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredSyllabuses = Array.isArray(syllabuses) ? syllabuses.filter(syllabus =>
    syllabus.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    syllabus.course.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Syllabus Management</h1>
          <p className="text-gray-600">Manage course syllabuses and materials</p>
        </div>
        {user?.role === 'admin' && (
          <Button
            onClick={() => setShowUploadModal(true)}
            icon={<Plus size={16} />}
          >
            Upload Syllabus
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search syllabuses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Syllabus List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabuses.map((syllabus, index) => (
            <motion.div
              key={syllabus._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="p-4">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{syllabus.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 truncate">{syllabus.course}</p>
                      <p className="text-xs text-gray-500 line-clamp-3">{syllabus.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSyllabus(syllabus)}
                      icon={<Eye size={14} />}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Download size={14} />}
                      className="flex-1"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredSyllabuses.length === 0 && !loading && (
        <Card>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No syllabuses found</h3>
            <p className="text-gray-600">
              {user?.role === 'admin' ? 'Upload your first syllabus to get started.' : 'No syllabuses available yet.'}
            </p>
          </div>
        </Card>
      )}

      {/* Upload Modal - Admin Only */}
      {user?.role === 'admin' && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Syllabus"
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter syllabus title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter course name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Enter description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="input-field"
                placeholder="Enter syllabus content"
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button type="submit" loading={uploading} className="flex-1">
                Upload Syllabus
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowUploadModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      <Modal
        isOpen={!!selectedSyllabus}
        onClose={() => setSelectedSyllabus(null)}
        title={selectedSyllabus?.title}
        size="lg"
      >
        {selectedSyllabus && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Course</h4>
              <p className="text-gray-600">{selectedSyllabus.course}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-600">{selectedSyllabus.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Content</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {selectedSyllabus.content}
                </pre>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button icon={<Download size={16} />}>
                Download PDF
              </Button>
              <Button variant="outline">
                Generate Mindmap
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default SyllabusPage;