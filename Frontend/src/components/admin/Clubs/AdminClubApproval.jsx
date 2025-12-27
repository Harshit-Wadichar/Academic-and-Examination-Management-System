import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import { CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { toast } from "react-hot-toast";

const AdminClubApproval = () => {
  // Cache structure: { Pending: [], Approved: [], Rejected: [] }
  const [clubsCache, setClubsCache] = useState({
    Pending: null,
    Approved: null,
    Rejected: null,
  });
  // We can keep loading state for background refreshing indicators if needed, 
  // but for the main layout, we rely on cache presence.
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending");

  // Helper to get current list from cache safely
  const currentClubs = clubsCache[activeTab] || [];
  
  // LOGIC FIX: Check explicitly for null to determine "Not Loaded Yet" state.
  // Using 'loading' state caused a 1-frame flash of empty state before effect ran.
  const isFirstLoad = clubsCache[activeTab] === null;

  useEffect(() => {
    fetchClubs();
  }, [activeTab]);

  const fetchClubs = async (isBackground = false) => {
    if (isFirstLoad && !isBackground) {
      setLoading(true);
    }

    try {
      const response = await api.get(`/clubs?status=${activeTab}`);
      const data = response.data.data || [];
      
      setClubsCache(prev => ({
        ...prev,
        [activeTab]: data
      }));
    } catch (error) {
      console.error(`Error fetching ${activeTab} clubs:`, error);
      toast.error(`Failed to load ${activeTab} clubs`);
      // On error, set to empty array so we don't get stuck on skeleton
      setClubsCache(prev => ({
        ...prev,
        [activeTab]: []
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (clubId) => {
    try {
      await api.put(`/clubs/${clubId}/approve`);
      toast.success("Club approved successfully!");
      
      // Invalidate both caches involved
      setClubsCache(prev => ({
        ...prev,
        Pending: null, 
        Approved: null 
      }));
      // Triggers re-fetch due to null cache + re-render or explicit call
      // Since we set to null, the UI will show skeleton immediately.
      // If we want to avoid skeleton during action, we would optimistically update the list instead of nulling.
      // But for now, ensuring accuracy.
      fetchClubs(); 
    } catch (error) {
      console.error("Error approving club:", error);
      toast.error("Failed to approve club");
    }
  };

  const handleReject = async (clubId) => {
    if (window.confirm("Are you sure you want to reject this club?")) {
      try {
        await api.put(`/clubs/${clubId}/reject`);
        toast.success("Club rejected");
        
        setClubsCache(prev => ({
          ...prev,
          Pending: null,
          Rejected: null
        }));
        fetchClubs();
      } catch (error) {
        console.error("Error rejecting club:", error);
        toast.error("Failed to reject club");
      }
    }
  };

  const tabs = [
    { id: "Pending", label: "Pending" },
    { id: "Approved", label: "Approved" },
    { id: "Rejected", label: "Rejected" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Club Approval Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and manage club requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isFirstLoad ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-3xl"></div>
            ))}
        </div>
      ) : currentClubs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              No {activeTab.toLowerCase()} clubs found
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentClubs.map((club) => (
            <Card key={club._id} className="overflow-hidden" animated={false}>
              {club.image && (
                <img
                  src={`http://localhost:5010${club.image}`}
                  alt={club.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {club.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                        club.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        club.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {club.status}
                    </span>
                </div>
               
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {club.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Coordinator: {club.coordinator?.name}</span>
                </div>
                
                {/* Only show actions for Pending clubs */}
                {activeTab === 'Pending' && (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleApprove(club._id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                        </Button>
                        <Button
                            onClick={() => handleReject(club._id)}
                            variant="danger"
                            className="flex-1"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                    </div>
                )}
                 {activeTab === 'Rejected' && (
                     <Button
                        onClick={() => handleApprove(club._id)} // Re-approve ability
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Re-Approve
                    </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminClubApproval;
