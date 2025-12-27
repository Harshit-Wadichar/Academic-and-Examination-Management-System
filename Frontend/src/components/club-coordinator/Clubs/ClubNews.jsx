import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import { Plus, Edit2, Trash2, Newspaper } from "lucide-react";
import { toast } from "react-hot-toast";

const ClubNews = ({ clubId, clubName }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (clubId) {
      fetchNews();
    }
  }, [clubId]);

  const fetchNews = async () => {
    try {
      const response = await api.get(`/clubs/${clubId}/news`);
      setNews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      if (error.response?.status !== 403) {
        toast.error("Failed to load news");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await api.put(`/clubs/${clubId}/news/${editingNews._id}`, formData);
        toast.success("News updated successfully!");
      } else {
        await api.post(`/clubs/${clubId}/news`, formData);
        toast.success("News created successfully!");
      }
      
      fetchNews();
      setShowModal(false);
      setEditingNews(null);
      setFormData({ title: "", content: "" });
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error(error.response?.data?.message || "Failed to save news");
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
    });
    setShowModal(true);
  };

  const handleDelete = async (newsId) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await api.delete(`/clubs/${clubId}/news/${newsId}`);
        toast.success("News deleted successfully!");
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
        toast.error(error.response?.data?.message || "Failed to delete news");
      }
    }
  };

  const handleAddNew = () => {
    setEditingNews(null);
    setFormData({ title: "", content: "" });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Club News - {clubName}
        </h3>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add News
        </Button>
      </div>

      {news.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              No news yet. Create your first news update!
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Posted by {item.createdBy?.name || "Unknown"} •{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="secondary"
                      size="sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item._id)}
                      variant="danger"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {item.content}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingNews ? "Edit News" : "Create News"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 text-slate-900 dark:text-white"
              placeholder="Enter news title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 resize-none text-slate-900 dark:text-white"
              placeholder="Write your news content..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="shadow-lg shadow-primary-500/20">
              {editingNews ? "Update News" : "Create News"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClubNews;
