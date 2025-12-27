import React, { useState, useEffect } from "react";
import { useApiMutation } from "../../../hooks/useApi";
import api from "../../../services/api";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Card from "../../common/UI/Card";
import { Check, X, Calendar, MapPin, AlertCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

const AdminEventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const { mutate } = useApiMutation();

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch events based on status
      const response = await api.get(`/events?status=${activeTab}`);
      setEvents(response.data.data || []);
    } catch (error) {
      console.error(`Error fetching ${activeTab} events:`, error);
      toast.error(`Failed to load ${activeTab} events`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await mutate("put", `/events/${eventId}/approve`);
      toast.success("Event approved successfully");
      fetchEvents(); // Refresh list
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Failed to approve event");
    }
  };

  const handleReject = async (eventId) => {
    if (window.confirm("Are you sure you want to reject this event?")) {
      try {
        // Use the new soft-reject endpoint
        await mutate("put", `/events/${eventId}/reject`);
        toast.success("Event rejected");
        fetchEvents(); // Refresh list
      } catch (error) {
        console.error("Error rejecting event:", error);
        toast.error("Failed to reject event");
      }
    }
  };

  // Only for completely removing an event (if needed, e.g. from Rejected tab)
  const handleDelete = async (eventId) => {
      if (window.confirm("Are you sure you want to permanently delete this event?")) {
        try {
          await mutate("delete", `/events/${eventId}`);
          toast.success("Event deleted permanently");
          fetchEvents();
        } catch (error) {
          console.error("Error deleting event:", error);
          toast.error("Failed to delete event");
        }
      }
  };

  const tabs = [
    { id: "Pending", label: "Pending" },
    { id: "Approved", label: "Approved" },
    { id: "Rejected", label: "Rejected" },
  ];

  const columns = [
    { 
        key: "title", 
        label: "Event Details",
        render: (event) => (
            <div>
              <div className="font-semibold text-slate-800 dark:text-white">{event?.title}</div>
              <div className="text-xs text-slate-500 line-clamp-1">{event?.description}</div>
            </div>
        )
    },
    {
        key: "organizer",
        label: "Organizer",
        render: (event) => (
            <div className="text-sm">
                <div className="font-medium text-slate-700 dark:text-slate-300">{event?.organizer?.name || 'Unknown'}</div>
                <div className="text-xs text-slate-500">{event?.organizer?.email}</div>
            </div>
        )
    },
    {
      key: "date",
      label: "Date & Time",
      render: (event) => (
          <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-primary-500" />
                {event?.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
              </div>
              <div className="flex items-center gap-1.5">
                 <Clock size={13} className="text-orange-500" />
                 {/* Assuming time might be part of date or separate, for now just date */}
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                     event?.status === 'Approved' ? 'bg-green-100 text-green-700' :
                     event?.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                     'bg-yellow-100 text-yellow-700'
                 }`}>
                    {event?.status}
                 </span>
              </div>
          </div>
      ),
    },
    { 
        key: "location", 
        label: "Location",
        render: (event) => (
            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                <MapPin size={14} className="text-secondary-500" />
                {event?.location}
            </div>
        )
    },
    {
      key: "actions",
      label: "Actions",
      render: (event) => (
        <div className="flex items-center gap-2">
            {activeTab === 'Pending' && (
                <>
                  <Button
                    onClick={() => handleApprove(event._id)}
                    variant="success"
                    size="sm"
                    className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                    icon={<Check size={16} />}
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(event._id)}
                    variant="danger"
                    size="sm"
                    className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
                    icon={<X size={16} />}
                  >
                    Reject
                  </Button>
                </>
            )}
            {activeTab === 'Rejected' && (
                 <>
                  <Button
                    onClick={() => handleApprove(event._id)}
                    variant="success"
                    size="sm"
                    className="bg-green-100 text-green-700 hover:bg-green-200"
                    icon={<Check size={16} />}
                  >
                    Re-Approve
                  </Button>
                  <Button
                    onClick={() => handleDelete(event._id)}
                    variant="danger"
                    size="sm"
                    icon={<X size={16} />}
                   >
                     Delete
                   </Button>
                 </>
            )}
             {/* Can add actions for Approved tab (e.g., Revoke/Reject) if needed */}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
       <Card variant="glass" className="border-l-4 border-l-yellow-500">
          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
               <AlertCircle size={24} />
            </div>
            <div>
               <h2 className="text-lg font-bold text-slate-800 dark:text-white">Event Approval Management</h2>
               <p className="text-slate-600 dark:text-slate-400 mt-1">
                 Manage event requests. Approved events are visible to students. 
                 Rejected events are archived in the Rejected tab.
               </p>
            </div>
          </div>
       </Card>

       {/* Tabs */}
       <div className="flex space-x-2 bg-white dark:bg-slate-800 p-1 rounded-xl w-fit shadow-sm border border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

       <Card variant="glass" noPadding>
           <Table 
              columns={columns} 
              data={events} 
              loading={loading} 
              emptyMessage={`No ${activeTab.toLowerCase()} events found.`}
            />
       </Card>
    </div>
  );
};

export default AdminEventApproval;
