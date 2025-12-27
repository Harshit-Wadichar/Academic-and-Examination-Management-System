import React from "react";
import { useApi } from "../../hooks/useApi";

const ExamSchedule = () => {
  const { data: exams, loading, error } = useApi("/exams/student");

  if (loading) {
    return <div className="text-center py-8">Loading exam schedule...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading exam schedule
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Exam Schedule</h2>
      {!exams?.data || exams.data.length === 0 ? (
        <p className="text-gray-600">No upcoming exams.</p>
      ) : (
        <div className="space-y-4">
          {exams.data.map((exam) => (
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
