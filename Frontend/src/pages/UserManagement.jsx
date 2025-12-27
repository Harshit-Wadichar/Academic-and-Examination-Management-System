import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronRight,
  GraduationCap,
  Shield,
  UserCog
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useApi, useApiMutation } from "../hooks/useApi";
import Card from "../components/common/UI/Card";
import Button from "../components/common/UI/Button";
import Modal from "../components/common/UI/Modal";
import { toast } from "react-hot-toast";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical"
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const UserManagement = () => {
  const { user } = useAuth();
  const { data: responseData, loading, refetch } = useApi("/users");
  const { mutate, loading: updating } = useApiMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("students"); // students | staff
  const [selectedDept, setSelectedDept] = useState("Computer Science");
  const [selectedSem, setSelectedSem] = useState(1);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    address: "",
  });

  const users = responseData?.data || [];

  const handleEditUser = (userData) => {
    setEditForm({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || "",
      address: userData.address || "",
    });
    setSelectedUser(userData);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const result = await mutate("put", `/users/${selectedUser._id}`, { role: editForm.role });
    if (result.success) {
      toast.success("Role updated successfully!");
      setShowEditModal(false);
      refetch();
    } else {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const result = await mutate("delete", `/users/${userId}`);
      if (result.success) {
        toast.success("User deleted successfully!");
        refetch();
      } else {
        toast.error("Failed to delete user");
      }
    }
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter((u) => {
      // 1. Search Filter
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Tab Filter (Students vs Staff)
      if (activeTab === "students") {
        if (u.role !== "student") return false;
        
        // 3. Dept & Sem Filter (Only for students)
        // Normalize strings for comparison
        const userDept = u.department || "";
        const userSem = u.semester ? parseInt(u.semester) : 0;
        
        return userDept === selectedDept && userSem === selectedSem;
      } else {
        // Staff tab shows non-students
        return u.role !== "student";
      }
    });
  }, [users, searchTerm, activeTab, selectedDept, selectedSem]);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "teacher":
        return "bg-green-100 text-green-800";
      case "seating_manager":
        return "bg-blue-100 text-blue-800";
      case "club_coordinator":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] opacity-20"></div>
           <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] opacity-20"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">User Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage students, faculty, and administrators</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'students' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
           className={`pb-2 px-4 font-medium ${activeTab === 'staff' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
           onClick={() => setActiveTab('staff')}
        >
          Staff & Admins
        </button>
      </div>

      {/* Hierarchy Filters (Only for Students) */}
      {activeTab === 'students' && (
        <div className="glass-card p-6 border border-white/20 dark:border-slate-700">
            <div className="space-y-4">
                {/* Departments */}
                <div className="flex flex-wrap gap-2">
                    {DEPARTMENTS.map(dept => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                selectedDept === dept 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                                : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                            }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>
                
                {/* Semesters */}
                <div className="flex items-center space-x-2 border-t pt-4 border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-2">Semester:</span>
                    {SEMESTERS.map(sem => (
                         <button
                            key={sem}
                            onClick={() => setSelectedSem(sem)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                selectedSem === sem
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-200 dark:ring-indigo-900'
                                : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                            }`}
                        >
                            {sem}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative glass p-2 rounded-2xl">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
            type="text"
            placeholder="Search within filtered list..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse h-20 bg-gray-200 rounded-xl"></div>
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
              <div className="glass-card hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors border border-white/20 dark:border-slate-700">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden ${userData.role === 'student' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                      {userData.profilePicture ? (
                        <img 
                          src={userData.profilePicture} 
                          alt={userData.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userData.role === 'student' ? <GraduationCap size={20} /> : <Users size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {userData.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-600 dark:text-slate-400 gap-2">
                        <span>{userData.email}</span>
                        {userData.department && (
                            <>
                                <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                                <span className="text-slate-500 dark:text-slate-400">{userData.department}</span>
                            </>
                        )}
                        {userData.semester && (
                             <>
                             <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                             <span className="text-slate-500 dark:text-slate-400">Sem {userData.semester}</span>
                         </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getRoleBadgeColor(userData.role)}`}>
                        {userData.role.replace("_", " ")}
                    </span>
                    
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <Card>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
                {activeTab === 'students' 
                    ? `No students found in ${selectedDept} - Semester ${selectedSem}` 
                    : "No staff members matching your search."}
            </p>
          </div>
        </Card>
      )}

      {/* Edit User Modal - Role Only */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Change Role: ${selectedUser?.name}`}
      >
        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl mb-6 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {selectedUser?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-lg text-slate-900 dark:text-white">{selectedUser?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{selectedUser?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Shield size={18} className="text-indigo-500" />
              Select New Role
            </label>
            
            <div className="space-y-3">
              {/* Student Role */}
              <div 
                onClick={() => setEditForm({ ...editForm, role: "student" })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  editForm.role === "student" 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-500/20" 
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      editForm.role === "student" 
                        ? "bg-blue-500 text-white" 
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}>
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Student</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Access to courses and exams</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    editForm.role === "student" 
                      ? "border-blue-500 bg-blue-500" 
                      : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {editForm.role === "student" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Teacher Role */}
              <div 
                onClick={() => setEditForm({ ...editForm, role: "teacher" })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  editForm.role === "teacher" 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md shadow-green-500/20" 
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      editForm.role === "teacher" 
                        ? "bg-green-500 text-white" 
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    }`}>
                      <UserCog size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Teacher</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Upload notes and manage courses</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    editForm.role === "teacher" 
                      ? "border-green-500 bg-green-500" 
                      : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {editForm.role === "teacher" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Role */}
              <div 
                onClick={() => setEditForm({ ...editForm, role: "admin" })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  editForm.role === "admin" 
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md shadow-purple-500/20" 
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      editForm.role === "admin" 
                        ? "bg-purple-500 text-white" 
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}>
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Admin</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Full system access and control</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    editForm.role === "admin" 
                      ? "border-purple-500 bg-purple-500" 
                      : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {editForm.role === "admin" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Seating Manager Role */}
              <div 
                onClick={() => setEditForm({ ...editForm, role: "seating_manager" })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  editForm.role === "seating_manager" 
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md shadow-orange-500/20" 
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-orange-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      editForm.role === "seating_manager" 
                        ? "bg-orange-500 text-white" 
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                    }`}>
                      <UserCog size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Seating Manager</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage exam seating arrangements</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    editForm.role === "seating_manager" 
                      ? "border-orange-500 bg-orange-500" 
                      : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {editForm.role === "seating_manager" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Club Coordinator Role */}
              <div 
                onClick={() => setEditForm({ ...editForm, role: "club_coordinator" })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  editForm.role === "club_coordinator" 
                    ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md shadow-pink-500/20" 
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pink-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      editForm.role === "club_coordinator" 
                        ? "bg-pink-500 text-white" 
                        : "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                    }`}>
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Club Coordinator</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage clubs and activities</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    editForm.role === "club_coordinator" 
                      ? "border-pink-500 bg-pink-500" 
                      : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {editForm.role === "club_coordinator" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" loading={updating} className="flex-1">
              Update Role
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
