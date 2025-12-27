import React, { useState, useEffect } from "react";
import { useApiMutation } from "../../../hooks/useApi";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import { toast } from "react-hot-toast";
import { BookOpen, Plus, Edit2, Trash2 } from "lucide-react";

const TeacherSyllabusManager = () => {
  const { user } = useAuth();
  const [syllabi, setSyllabi] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    content: "",
  });
  const { mutate } = useApiMutation();

  useEffect(() => {
    fetchSyllabus();
    fetchSubjects();
  }, []);

  const fetchSyllabus = async () => {
    try {
      const response = await api.get("/syllabus");
      setSyllabi(response.data.data || []);
    } catch (error) {
      console.error("Error fetching syllabi:", error);
      toast.error("Failed to fetch syllabi");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/syllabus/teacher/subjects");
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingSyllabus) {
        result = await mutate(
          "put",
          `/syllabus/${editingSyllabus._id}`,
          formData
        );
      } else {
        result = await mutate("post", "/syllabus", formData);
      }
      if (result.success) {
        toast.success(
          editingSyllabus
            ? "Syllabus updated successfully"
            : "Syllabus created successfully"
        );
        fetchSyllabus();
        setShowModal(false);
        setEditingSyllabus(null);
        setFormData({ title: "", subject: "", description: "", content: "" });
      }
    } catch (error) {
      console.error("Error saving syllabus:", error);
      toast.error(error.response?.data?.message || "Failed to save syllabus");
    }
  };

  const handleEdit = (syllabus) => {
    setEditingSyllabus(syllabus);
    // Handle both populated object and direct ID ID
    const subjectId = syllabus.subject?._id || syllabus.subject;
    
    setFormData({
      title: syllabus.title,
      subject: subjectId,
      description: syllabus.description || "",
      content: syllabus.content,
    });
    setShowModal(true);
  };

  const handleDelete = async (syllabusId) => {
    if (!syllabusId) {
       toast.error("Invalid Syllabus ID");
       return;
    }
    if (window.confirm("Are you sure you want to delete this syllabus?")) {
      try {
        const result = await mutate("delete", `/syllabus/${syllabusId}`);
        if (result.success) {
          toast.success("Syllabus deleted successfully");
          fetchSyllabus();
        } else {
          // Explicitly show error from backend result if success is false
          toast.error(result.message || "Failed to delete syllabus");
        }
      } catch (error) {
        console.error("Error deleting syllabus:", error);
        toast.error(error.response?.data?.message || "Failed to delete syllabus");
      }
    }
  };

  const handleOpenModal = () => {
    setEditingSyllabus(null);
    setFormData({ title: "", subject: "", description: "", content: "" });
    setShowModal(true);
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "subject",
      label: "Subject",
      render: (_, syllabus) => {
        // Direct access to populated subject
        return syllabus.subject?.courseName || syllabus.subject?.courseCode || "N/A";
      }
    },
    {
      key: "semester",
      label: "Semester",
      render: (_, syllabus) => {
        // Prefer syllabus.semester, then subject.semester
        return syllabus.semester || syllabus.subject?.semester || "N/A";
      }
    },
    {
      key: "department",
      label: "Department",
      render: (_, syllabus) => {
        // Prefer syllabus.department, then subject.department
        return syllabus.department || syllabus.subject?.department || "N/A";
      }
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, syllabus) => {
        // Only show actions if user is the creator
        const isCreator = syllabus.createdBy?._id === user?._id || syllabus.createdBy === user?._id;
        
        if (!isCreator) return <span className="text-gray-400 text-sm italic">View Only</span>;

        return (
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(syllabus);
              }}
              variant="secondary"
              size="sm"
              icon={<Edit2 size={16} />}
            >
              Edit
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(syllabus._id);
              }}
              variant="danger"
              size="sm"
              icon={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <BookOpen className="mr-3 text-primary-500" size={32} />
          Syllabus Management
        </h2>
        <Button onClick={handleOpenModal} icon={<Plus size={20} />}>
          Create Syllabus
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading syllabi...</div>
      ) : syllabi.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No syllabus created yet. Click "Create Syllabus" to get started.
        </div>
      ) : (
        <Table columns={columns} data={syllabi} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          {editingSyllabus ? "Edit Syllabus" : "Create Syllabus"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject *
            </label>
            <select
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.courseCode} - {subject.courseName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              placeholder="e.g., Data Structures and Algorithms - Fall 2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              placeholder="Brief overview of the syllabus"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={12}
              className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm p-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="Enter the complete syllabus content here..."
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingSyllabus ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherSyllabusManager;
