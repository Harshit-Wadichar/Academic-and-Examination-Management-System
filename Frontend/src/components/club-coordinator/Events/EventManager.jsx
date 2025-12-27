import React, { useState, useEffect } from "react";
import { useApiMutation } from "../../../hooks/useApi";
import api from "../../../services/api";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import Card from "../../common/UI/Card";
import { Megaphone, MapPin, Calendar, Users, Star } from "lucide-react";
import { toast } from "react-hot-toast";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  });
  const { mutate } = useApiMutation();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await mutate("put", `/events/${editingEvent._id}`, formData);
        toast.success("Event updated successfully");
      } else {
        await mutate("post", "/events", formData);

        toast.success("Event submitted for approval");
      }
      fetchEvents();
      setShowModal(false);
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: "",
      });
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0], // Format for input
      location: event.location,
      capacity: event.capacity,
    });
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await mutate("delete", `/events/${eventId}`);
        toast.success("Event deleted");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const columns = [
    { 
        key: "title", 
        label: "Title",
        render: (value) => (
            <span className="font-semibold text-slate-800 dark:text-white">{value}</span>
        )
    },
    {
      key: "date",
      label: "Date",
      render: (value, event) => (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar size={14} className="text-secondary-500" />
              {new Date(event.date).toLocaleDateString()}
          </div>
      ),
    },
    { 
        key: "location", 
        label: "Location",
        render: (value) => (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin size={14} className="text-secondary-500" />
                {value}
            </div>
        )
    },
    {
      key: "interested",
      label: "Interested",
      render: (value, event) => (
        <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full w-fit">
          <Star size={12} fill="currentColor" />
          {event.interestedUsers?.length || 0}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value, event) => {
        const statusColors = {
          Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
          Approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
          Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[event.status || 'Pending']} flex items-center gap-1.5 w-fit`}>
            {event.status === 'Approved' && <Users size={12} />}
            {event.status || 'Pending'}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, event) => (
        <div className="space-x-2">
          <Button
            onClick={() => handleEdit(event)}
            variant="secondary"
            size="xs"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(event._id)}
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/20 text-white">
                    <Megaphone size={24} />
                </div>
                <div>
                   <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Event Management</h1>
                   <p className="text-slate-600 dark:text-slate-400 font-medium">Coordinate and broadcast college events</p>
                </div>
            </div>
            
            <Button onClick={() => setShowModal(true)} icon={<Megaphone size={16} />} className="shadow-lg shadow-primary-500/20">
                Create Event
            </Button>
        </div>


        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
           <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-full text-blue-600 dark:text-blue-400">
             <Calendar size={20} />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 dark:text-blue-100">Event Approval Process</h3>
             <p className="text-sm text-slate-600 dark:text-blue-200 mt-1">
               New events require Admin approval before they are visible to students. 
               You can track the status of your events in the table below.
             </p>
           </div>
        </div>

        <Card variant="glass" className="border border-white/20 dark:border-slate-700 p-1" noPadding>
             <Table columns={columns} data={events} loading={loading} />
        </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingEvent ? "Edit Event" : "Create Event"}>
        <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="text-primary-500" />
                {editingEvent ? "Update Event Details" : "New Event Details"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Fill in the information to broadcast this event to students.
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400"
              placeholder="e.g. Annual Tech Symposium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 resize-none"
              placeholder="Describe the event highlights and agenda..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Date
                </label>
                <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400"
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
                placeholder="e.g. 200"
                required
                />
            </div>
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
              placeholder="e.g. Main Auditorium"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="shadow-lg shadow-primary-500/20">{editingEvent ? "Update Event" : "Create Event"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventManager;
