import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Edit3, Save, X, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useApiMutation } from "../hooks/useApi";
import Card from "../components/common/UI/Card";
import Button from "../components/common/UI/Button";
import ImageUploadModal from "../components/common/UI/ImageUploadModal";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { mutate, loading } = useApiMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    rollNumber: user?.rollNumber || "",
    course: user?.course || "",
    department: user?.department || "",
    address: user?.address || "",
    bio: user?.bio || "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      rollNumber: user?.rollNumber || "",
      course: user?.course || "",
      department: user?.department || "",
      address: user?.address || "",
      bio: user?.bio || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const result = await mutate("put", "/users/profile", formData);
    if (result.success) {
      updateUser(formData); // Update context and localStorage
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      rollNumber: user?.rollNumber || "",
      course: user?.course || "",
      department: user?.department || "",
      address: user?.address || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-5xl mx-auto space-y-6 min-h-screen"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[100px] opacity-20"></div>
           <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-400/20 rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} icon={<Edit3 size={16} />}>
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              loading={loading}
              icon={<Save size={16} />}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              icon={<X size={16} />}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-white/20 dark:border-slate-700 lg:col-span-1 h-fit">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <div className="w-full h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/50 dark:ring-slate-700/50 overflow-hidden">
                {user?.profilePicture ? (
                   <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                   <User size={48} className="text-white" />
                )}
              </div>
              <button 
                onClick={() => setShowImageModal(true)}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={32} className="text-white drop-shadow-lg" />
              </button>
            </div>
            
            <ImageUploadModal 
              isOpen={showImageModal} 
              onClose={() => setShowImageModal(false)}
              onUploadSuccess={(newUrl) => {
                 updateUser({ ...user, profilePicture: newUrl });
              }}
            />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 capitalize font-medium">{user?.role}</p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-400 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Mail size={16} className="text-indigo-500" />
                <span className="text-sm">{user?.email}</span>
              </div>
              {user?.studentId && (
                <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-400 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <User size={16} className="text-indigo-500" />
                  <span className="text-sm">ID: {user.studentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border border-white/20 dark:border-slate-700 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {user?.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <p className="text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                {user?.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {formData.phone || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Roll Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  placeholder="e.g., CS2021001"
                />
              ) : (
                <p className="text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {formData.rollNumber || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Course
              </label>
              {isEditing ? (
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white appearance-none"
                >
                  <option value="">Select Course</option>
                  <option value="B-Tech">B-Tech</option>
                  <option value="M-Tech">M-Tech</option>
                  <option value="Polytechnic">Polytechnic</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="BBA">BBA</option>
                  <option value="BCA">BCA</option>
                </select>
              ) : (
                <p className="text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {formData.course || "Not specified"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {formData.department || "Not specified"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {formData.address || "Not provided"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {formData.bio || "No bio added"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
