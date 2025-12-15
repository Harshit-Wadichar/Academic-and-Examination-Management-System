import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import Table from "../common/UI/Table";
import Button from "../common/UI/Button";
import Modal from "../common/UI/Modal";

const SyllabusManager = () => {
  const [syllabi, setSyllabi] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    content: "",
  });
  const { apiCall } = useApi();

  useEffect(() => {
    fetchSyllabi();
    fetchCourses();
  }, []);

  const fetchSyllabi = async () => {
    try {
      // TODO: Implement actual API call using useApi hook
      const response = await apiCall("/syllabus", "GET");
      setSyllabi(response.data);
    } catch (error) {
      console.error("Error fetching syllabi:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      // TODO: Implement actual API call using useApi hook
      const response = await apiCall("/courses", "GET");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSyllabus) {
        // TODO: Implement actual API call using useApi hook
        await apiCall(`/syllabus/${editingSyllabus._id}`, "PUT", formData);
      } else {
        // TODO: Implement actual API call using useApi hook
        await apiCall("/syllabus", "POST", formData);
      }
      fetchSyllabi();
      setShowModal(false);
      setEditingSyllabus(null);
      setFormData({ title: "", course: "", content: "" });
    } catch (error) {
      console.error("Error saving syllabus:", error);
    }
  };

  const handleEdit = (syllabus) => {
    setEditingSyllabus(syllabus);
    setFormData({
      title: syllabus.title,
      course: syllabus.course._id,
      content: syllabus.content,
    });
    setShowModal(true);
  };

  const handleDelete = async (syllabusId) => {
    if (window.confirm("Are you sure you want to delete this syllabus?")) {
      try {
        // TODO: Implement actual API call using useApi hook
        await apiCall(`/syllabus/${syllabusId}`, "DELETE");
        fetchSyllabi();
      } catch (error) {
        console.error("Error deleting syllabus:", error);
      }
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "course",
      label: "Course",
      render: (syllabus) => syllabus.course?.name,
    },
    {
      key: "actions",
      label: "Actions",
      render: (syllabus) => (
        <div className="space-x-2">
          <Button
            onClick={() => handleEdit(syllabus)}
            variant="secondary"
            size="sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(syllabus._id)}
            variant="danger"
            size="sm"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Syllabus Management
        </h2>
        <Button onClick={() => setShowModal(true)}>Add Syllabus</Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading syllabi...</div>
      ) : (
        <Table columns={columns} data={syllabi} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-bold mb-4">
          {editingSyllabus ? "Edit Syllabus" : "Add Syllabus"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <select
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={10}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
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

export default SyllabusManager;
