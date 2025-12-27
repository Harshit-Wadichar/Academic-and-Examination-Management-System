import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import { CheckCircle, XCircle, Users, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

const ClubJoinRequests = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get("/clubs");
      // Filter only coordinator's clubs
      setClubs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      toast.error("Failed to load clubs");
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async (clubId) => {
    try {
      const response = await api.get(`/clubs/${clubId}/join-requests`);
      setJoinRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching join requests:", error);
      toast.error("Failed to load join requests");
    }
  };

  const handleApprove = async (clubId, userId) => {
    try {
      await api.put(`/clubs/${clubId}/approve-member/${userId}`);
      toast.success("Member approved successfully!");
      fetchJoinRequests(clubId);
      fetchClubs();
    } catch (error) {
      console.error("Error approving member:", error);
      toast.error("Failed to approve member");
    }
  };

  const handleReject = async (clubId, userId) => {
    try {
      await api.put(`/clubs/${clubId}/reject-member/${userId}`);
      toast.success("Request rejected");
      fetchJoinRequests(clubId);
    } catch (error) {
      console.error("Error rejecting member:", error);
      toast.error("Failed to reject request");
    }
  };

  const handleViewRequests = (club) => {
    setSelectedClub(club);
    fetchJoinRequests(club._id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Club Join Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage membership requests for your clubs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {clubs.map((club) => {
          const pendingCount = club.joinRequests?.filter(
            (req) => req.status === "Pending"
          ).length || 0;

          return (
            <Card key={club._id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {club.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{club.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{pendingCount} pending requests</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewRequests(club)}
                  className="w-full"
                  disabled={pendingCount === 0}
                >
                  View Requests ({pendingCount})
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedClub && (
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Join Requests for {selectedClub.name}
            </h2>

            {joinRequests.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  No pending join requests
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {joinRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {request.student?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.student?.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Requested: {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(selectedClub._id, request.student._id)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedClub._id, request.student._id)}
                        variant="danger"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ClubJoinRequests;
