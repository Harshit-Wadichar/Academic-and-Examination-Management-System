import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";

const SyllabusViewer = ({ courseId }) => {
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    if (courseId) {
      fetchSyllabus();
    }
  }, [courseId]);

  const fetchSyllabus = async () => {
    try {
      // TODO: Implement actual API call using useApi hook
      const response = await apiCall(`/syllabus/course/${courseId}`, "GET");
      setSyllabus(response.data);
    } catch (error) {
      console.error("Error fetching syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading syllabus...</div>;
  }

  if (!syllabus) {
    return (
      <div className="text-center py-8 text-gray-600">
        No syllabus available for this course.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {syllabus.title}
      </h2>
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-gray-700">
          {syllabus.content}
        </div>
      </div>
      {syllabus.attachments && syllabus.attachments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Attachments</h3>
          <div className="space-y-2">
            {syllabus.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                {attachment.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusViewer;
