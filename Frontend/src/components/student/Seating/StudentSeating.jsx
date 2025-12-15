import React, { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import { MapPin, Calendar, Clock, User } from "lucide-react";

const StudentSeating = () => {
  const { user } = useAuth();
  const { data: seatingData, loading } = useApi("/seating/student");
  const [selectedSeating, setSelectedSeating] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewSeating = (seating) => {
    setSelectedSeating(seating);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          My Seating Arrangements
        </h2>
        <p className="text-gray-600">
          View your examination seating arrangements
        </p>
      </div>

      {seatingData?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seatingData.data.map((seating) => (
            <Card
              key={seating._id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">
                      {seating.exam?.title || "Exam"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {seating.exam?.course?.name || "Course"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(seating.exam?.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {seating.exam?.startTime}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    Hall {seating.hall}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    Seat {seating.seatNumber}
                  </div>
                </div>

                <Button
                  onClick={() => handleViewSeating(seating)}
                  className="w-full"
                  variant="outline"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Seating Arrangements
          </h3>
          <p className="text-gray-600">
            You don't have any seating arrangements assigned yet.
          </p>
        </div>
      )}

      {/* Seating Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Seating Details"
      >
        {selectedSeating && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Exam
                </label>
                <p className="text-sm text-gray-900">
                  {selectedSeating.exam?.title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <p className="text-sm text-gray-900">
                  {selectedSeating.exam?.course?.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedSeating.exam?.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <p className="text-sm text-gray-900">
                  {selectedSeating.exam?.startTime} -{" "}
                  {selectedSeating.exam?.endTime}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hall
                </label>
                <p className="text-sm text-gray-900">
                  Hall {selectedSeating.hall}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seat Number
                </label>
                <p className="text-sm text-gray-900">
                  {selectedSeating.seatNumber}
                </p>
              </div>
            </div>
            {selectedSeating.instructions && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedSeating.instructions}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentSeating;
