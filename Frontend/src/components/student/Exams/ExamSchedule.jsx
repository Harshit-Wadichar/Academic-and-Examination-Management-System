import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      // TODO: Implement actual API call using useApi hook
      const response = await apiCall("/exams/student", "GET");
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading exam schedule...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Exam Schedule</h2>
      {exams.length === 0 ? (
        <p className="text-gray-600">No upcoming exams.</p>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {exam.title}
              </h3>
              <p className="text-gray-600">{exam.course?.name}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Date: {new Date(exam.date).toLocaleDateString()}</p>
                <p>Time: {exam.time}</p>
                <p>Duration: {exam.duration} minutes</p>
                <p>Venue: {exam.venue}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamSchedule;
