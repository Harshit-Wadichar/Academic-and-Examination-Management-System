import React, { useState, useEffect } from "react";
import { useApiMutation } from "../../../hooks/useApi";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import { Image as ImageIcon, Upload, Users, Newspaper } from "lucide-react";
import { toast } from "react-hot-toast";
import ClubNews from "./ClubNews";

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedClubForNews, setSelectedClubForNews] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { mutate } = useApiMutation();
  const { user } = useAuth();

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
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }
      
      if (editingClub) {
        await api.put(`/clubs/${editingClub._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Club updated successfully");
      } else {
        await api.post("/clubs", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Club created! Waiting for admin approval.");
      }
      
      fetchClubs();
      setShowModal(false);
      setEditingClub(null);
      setFormData({ name: "", description: "" });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error saving club:", error);
      toast.error(error.response?.data?.message || "Failed to save club");
    }
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setFormData({
      name: club.name,
      description: club.description,
    });
    setImagePreview(club.image ? `http://localhost:5010${club.image}` : null);
    setShowModal(true);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (clubId) => {
    if (window.confirm("Are you sure you want to delete this club? This action cannot be undone.")) {
      try {
        const response = await api.delete(`/clubs/${clubId}`);
        if (response.data.success) {
          toast.success("Club deleted successfully!");
          fetchClubs();
        }
      } catch (error) {
        console.error("Error deleting club:", error);
        toast.error(error.response?.data?.message || "Failed to delete club. Please try again.");
      }
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (value, club) => (
        club.image ? (
          <img
            src={`http://localhost:5010${club.image}`}
            alt={club.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Users className="w-8 h-8 text-white opacity-50" />
          </div>
        )
      ),
    },
    { key: "name", label: "Club Name" },
    { key: "description", label: "Description" },
    {
      key: "status",
      label: "Status",
      render: (value, club) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            club.status === "Approved"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : club.status === "Pending"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {club.status}
        </span>
      ),
    },
    {
      key: "members",
      label: "Members",
      render: (value, club) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {club.members?.length || 0}
        </span>
      ),
    },
    {
      key: "coordinator",
      label: "Coordinator",
      render: (value, club) => club.coordinator?.name,
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, club) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedClubForNews(club);
              setShowNewsModal(true);
            }}
            variant="primary"
            size="sm"
          >
            <Newspaper className="w-4 h-4 mr-1" />
            News
          </Button>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingClub ? "Edit Club" : "Create Club"}>
        <div className="border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingClub ? "Update Club Details" : "New Club Details"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Fill in the information to manage this club.
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Club Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 text-slate-900 dark:text-white"
              placeholder="e.g. Photography Club"
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
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 resize-none text-slate-900 dark:text-white"
              placeholder="Describe the club's purpose and activities..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Club Image
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Club preview"
                  className="w-full h-48 object-cover rounded-xl mb-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                <label className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-700 font-medium">
                    Choose an image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-500 mt-1">Max size: 5MB</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Coordinator
            </label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
              placeholder="Your name from profile"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">To change your name, update it in your profile settings</p>
          </div>
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="shadow-lg shadow-primary-500/20">{editingClub ? "Update Club" : "Create Club"}</Button>
          </div>
        </form>
      </Modal>

      {/* Club News Modal */}
      <Modal
        isOpen={showNewsModal}
        onClose={() => {
          setShowNewsModal(false);
          setSelectedClubForNews(null);
        }}
        title="Manage Club News"
        size="large"
      >
        {selectedClubForNews && (
          <ClubNews
            clubId={selectedClubForNews._id}
            clubName={selectedClubForNews.name}
          />
        )}
      </Modal>
    </div>
  );
};

export default ClubManagement;
