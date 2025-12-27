import React, { useState, useEffect } from "react";
import { useApiMutation } from "../../../hooks/useApi";
import api from "../../../services/api";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import Card from "../../common/UI/Card";
import { MapPin, Users, Building2 } from "lucide-react";

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
    { 
        key: "name", 
        label: "Hall Name",
        render: (hall) => (
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={16} className="text-slate-400" />
                {hall?.name}
            </div>
        )
    },
    { 
        key: "capacity", 
        label: "Capacity",
        render: (hall) => (
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Users size={14} /> {hall?.capacity} Seats
            </div>
        )
    },
    { 
        key: "location", 
        label: "Location",
        render: (hall) => (
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <MapPin size={14} /> {hall?.location}
            </div>
        )
    },
    {
      key: "actions",
      label: "Actions",
      render: (hall) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleEdit(hall)}
            variant="secondary"
            size="xs"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(hall._id)}
            variant="danger"
            size="xs"
            className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative p-6">


      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/20 text-white">
                <Building2 size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Hall Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage examination halls and seating capacities
                </p>
            </div>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center shadow-lg shadow-primary-500/20">
            <span className="mr-2 text-lg">+</span> Add New Hall
          </Button>
        </div>

        {/* Content Card */}
        <Card variant="glass" className="border border-white/20 dark:border-slate-700 p-1" noPadding>
            <Table columns={columns} data={halls} loading={loading} />
        </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingHall ? "Edit Hall" : "Add Hall"}>
         <div className="text-slate-900 dark:text-white mb-6 font-bold text-lg border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
            <Building2 className="text-primary-500" />
            {editingHall ? "Edit Hall Configuration" : "New Hall Configuration"}
         </div>
         
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Hall Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400"
              placeholder="e.g. Main Auditorium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400"
               placeholder="e.g. 100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400"
               placeholder="e.g. Block A, 2nd Floor"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8 shadow-lg shadow-primary-500/20">{editingHall ? "Update Hall" : "Create Hall"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HallManagement;
