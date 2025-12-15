import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useApi, useApiMutation } from '../hooks/useApi';
import Card from '../components/common/UI/Card';
import Button from '../components/common/UI/Button';
import Modal from '../components/common/UI/Modal';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const { user } = useAuth();
  const { data: users, loading, refetch } = useApi('/users');
  const { mutate, loading: updating } = useApiMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    address: ''
  });

  const handleEditUser = (userData) => {
    setEditForm({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || '',
      address: userData.address || ''
    });
    setSelectedUser(userData);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const result = await mutate('put', `/users/${selectedUser._id}`, editForm);
    if (result.success) {
      toast.success('User updated successfully!');
      setShowEditModal(false);
      refetch();
    } else {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await mutate('delete', `/users/${userId}`);
      if (result.success) {
        toast.success('User deleted successfully!');
        refetch();
      } else {
        toast.error('Failed to delete user');
      }
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  }) : [];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'seating_manager': return 'bg-blue-100 text-blue-800';
      case 'club_coordinator': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
            <option value="seating_manager">Seating Managers</option>
            <option value="club_coordinator">Club Coordinators</option>
          </select>
        </div>
      </Card>

      {/* Users List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((userData, index) => (
            <motion.div
              key={userData._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{userData.name}</h3>
                      <p className="text-sm text-gray-600">{userData.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(userData.role)}`}>
                          {userData.role.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Joined {new Date(userData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(userData)}
                      icon={<Edit size={14} />}
                    >
                      Edit
                    </Button>
                    {userData._id !== user.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(userData._id)}
                        icon={<Trash2 size={14} />}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <Card>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">No users match your search criteria.</p>
          </div>
        </Card>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              required
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              required
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({...editForm, role: e.target.value})}
              required
              className="input-field"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="seating_manager">Seating Manager</option>
              <option value="club_coordinator">Club Coordinator</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={editForm.address}
              onChange={(e) => setEditForm({...editForm, address: e.target.value})}
              rows={3}
              className="input-field"
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit" loading={updating} className="flex-1">
              Update User
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default UserManagement;