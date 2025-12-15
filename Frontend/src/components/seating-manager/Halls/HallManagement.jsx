import React, { useState, useEffect } from "react";
import { useApiMutation } from "../../../hooks/useApi";
import api from "../../../services/api";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";

const HallManagement = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    location: "",
  });
  const { mutate } = useApiMutation();

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await api.get("/halls");
      setHalls(response.data.data || []);
    } catch (error) {
      console.error("Error fetching halls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHall) {
        await mutate("put", `/halls/${editingHall._id}`, formData);
      } else {
        await mutate("post", "/halls", formData);
      }
      fetchHalls();
      setShowModal(false);
      setEditingHall(null);
      setFormData({ name: "", capacity: "", location: "" });
    } catch (error) {
      console.error("Error saving hall:", error);
    }
  };

  const handleEdit = (hall) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      capacity: hall.capacity,
      location: hall.location,
    });
    setShowModal(true);
  };

  const handleDelete = async (hallId) => {
    if (window.confirm("Are you sure you want to delete this hall?")) {
      try {
        await api.delete(`/halls/${hallId}`);
        fetchHalls();
      } catch (error) {
        console.error("Error deleting hall:", error);
      }
    }
  };

  const columns = [
    { key: "name", label: "Hall Name" },
    { key: "capacity", label: "Capacity" },
    { key: "location", label: "Location" },
    {
      key: "actions",
      label: "Actions",
      render: (hall) => (
        <div className="space-x-2">
          <Button
            onClick={() => handleEdit(hall)}
            variant="secondary"
            size="sm"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(hall._id)}
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
        <h2 className="text-2xl font-bold text-gray-800">Hall Management</h2>
        <Button onClick={() => setShowModal(true)}>Add Hall</Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading halls...</div>
      ) : (
        <Table columns={columns} data={halls} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-bold mb-4">
          {editingHall ? "Edit Hall" : "Add Hall"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hall Name
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
              Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
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
            <Button type="submit">{editingHall ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HallManagement;
