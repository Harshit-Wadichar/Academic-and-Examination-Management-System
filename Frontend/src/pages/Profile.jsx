import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Edit3, Save, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useApiMutation } from "../hooks/useApi";
import Card from "../components/common/UI/Card";
import Button from "../components/common/UI/Button";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { mutate, loading } = useApiMutation();
  const [isEditing, setIsEditing] = useState(false);
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
      className="p-6 max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
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
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.name}
            </h2>
            <p className="text-gray-600 capitalize">{user?.role}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">{user?.email}</span>
              </div>
              {user?.studentId && (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <User size={16} />
                  <span className="text-sm">ID: {user.studentId}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2" title="Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {user?.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {user?.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formData.phone || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., CS2021001"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formData.rollNumber || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., B.Tech Computer Science"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formData.course || "Not specified"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formData.department || "Not specified"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formData.address || "Not provided"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formData.bio || "No bio added"}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;
