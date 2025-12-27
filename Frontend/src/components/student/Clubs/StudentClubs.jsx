import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import { Users, Calendar, UserPlus, CheckCircle, Newspaper } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import Modal from "../../common/UI/Modal";

const StudentClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubNews, setClubNews] = useState([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get("/clubs");
      setClubs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      toast.error("Failed to load clubs");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (clubId) => {
    try {
      await api.post(`/clubs/${clubId}/join-request`);
      toast.success("Join request sent! Waiting for coordinator approval.");
      fetchClubs();
    } catch (error) {
      console.error("Error sending join request:", error);
      toast.error(error.response?.data?.message || "Failed to send join request");
    }
  };

  const handleViewNews = async (club) => {
    try {
      const response = await api.get(`/clubs/${club._id}/news`);
      setClubNews(response.data.data || []);
      setSelectedClub(club);
      setShowNewsModal(true);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error(error.response?.data?.message || "Failed to load news");
    }
  };

  const getJoinRequestStatus = (club) => {
    if (!user?.id) return null;
    const request = club.joinRequests?.find(
      (req) => {
        const studentId = typeof req.student === 'string' ? req.student : req.student?._id;
        return studentId === user.id;
      }
    );
    return request?.status;
  };

  const isMember = (club) => {
    if (!user?.id) return false;
    return club.members?.some(
      (member) => {
        const memberId = typeof member === 'string' ? member : member?._id;
        return memberId === user.id;
      }
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center mb-3">
          <Users className="mr-3 text-indigo-500" size={32} />
          College Clubs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Explore and join clubs that match your interests
        </p>
      </div>

      {clubs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              No clubs available yet
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const joinStatus = getJoinRequestStatus(club);
            const memberStatus = isMember(club);

            return (
              <Card key={club._id} className="overflow-hidden hover:shadow-lg transition-shadow" animated={false}>
                {club.image ? (
                  <img
                    src={`http://localhost:5010${club.image}`}
                    alt={club.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white opacity-50" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {club.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {club.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{club.members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <UserPlus className="w-4 h-4 mr-2" />
                      <span>Coordinator: {club.coordinator?.name}</span>
                    </div>
                  </div>

                  {memberStatus ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center py-2 px-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="font-medium">Member</span>
                      </div>
                      <Button
                        onClick={() => handleViewNews(club)}
                        className="w-full"
                        variant="secondary"
                      >
                        <Newspaper className="w-4 h-4 mr-2" />
                        View News
                      </Button>
                    </div>
                  ) : joinStatus === "Pending" ? (
                    <div className="flex items-center justify-center py-2 px-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">Request Pending</span>
                    </div>
                  ) : joinStatus === "Rejected" ? (
                    <div className="flex items-center justify-center py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
                      <span className="font-medium">Request Rejected</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleJoinRequest(club._id)}
                      className="w-full"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Request to Join
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* News Modal */}
      <Modal
        isOpen={showNewsModal}
        onClose={() => {
          setShowNewsModal(false);
          setSelectedClub(null);
          setClubNews([]);
        }}
        title={`${selectedClub?.name} - News & Updates`}
        size="large"
      >
        {clubNews.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              No news updates yet
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {clubNews.map((item) => (
              <Card key={item._id} className="p-6">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Posted by {item.createdBy?.name || "Unknown"} •{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {item.content}
                </p>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentClubs;
