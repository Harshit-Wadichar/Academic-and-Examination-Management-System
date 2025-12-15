import React, { useState, useEffect } from "react";
import { useApiMutation } from "../../../hooks/useApi";
import api from "../../../services/api";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coordinator: "",
  });
  const { mutate } = useApiMutation();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get("/clubs");
      setClubs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClub) {
        await mutate("put", `/clubs/${editingClub._id}`, formData);
      } else {
        await mutate("post", "/clubs", formData);
      }
      fetchClubs();
      setShowModal(false);
      setEditingClub(null);
      setFormData({ name: "", description: "", coordinator: "" });
    } catch (error) {
      console.error("Error saving club:", error);
    }
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setFormData({
      name: club.name,
      description: club.description,
      coordinator: club.coordinator?._id || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (clubId) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      try {
        await api.delete(`/clubs/${clubId}`);
        fetchClubs();
      } catch (error) {
        console.error("Error deleting club:", error);
      }
    }
  };

  const columns = [
    { key: "name", label: "Club Name" },
    { key: "description", label: "Description" },
    {
      key: "coordinator",
      label: "Coordinator",
      render: (club) => club.coordinator?.name,
    },
    {
      key: "actions",
      label: "Actions",
      render: (club) => (
        <div className="space-x-2">
          <Button
            onClick={() => handleEdit(club)}
            variant="secondary"
            size="sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(club._id)}
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
        <h2 className="text-2xl font-bold text-gray-800">Club Management</h2>
        <Button onClick={() => setShowModal(true)}>Create Club</Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading clubs...</div>
      ) : (
        <Table columns={columns} data={clubs} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-bold mb-4">
          {editingClub ? "Edit Club" : "Create Club"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Club Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Coordinator
            </label>
            <input
              type="text"
              value={formData.coordinator}
              onChange={(e) =>
                setFormData({ ...formData, coordinator: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Coordinator ID or Name"
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
            <Button type="submit">{editingClub ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClubManagement;
