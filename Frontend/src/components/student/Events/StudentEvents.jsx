import React, { useState } from "react";
import { useApi } from "../../../hooks/useApi";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import { Calendar, Clock, MapPin, Users, Trophy } from "lucide-react";

const StudentEvents = () => {
  const { data: eventsData, loading } = useApi("/events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const getEventTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "cultural":
        return "bg-purple-100 text-purple-800";
      case "technical":
        return "bg-blue-100 text-blue-800";
      case "sports":
        return "bg-green-100 text-green-800";
      case "academic":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const events = eventsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          College Events
        </h2>
        <p className="text-gray-600">
          Stay updated with upcoming college events and activities
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event._id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time || "TBD"}
                  </div>
                  {event.venue && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.venue}
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}

                <Button
                  onClick={() => handleViewEvent(event)}
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
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events</h3>
          <p className="text-gray-600">
            There are no upcoming events at the moment.
          </p>
        </div>
      )}

      {/* Event Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedEvent.title}
              </h3>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getEventTypeColor(
                  selectedEvent.type
                )}`}
              >
                {selectedEvent.type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <p className="text-sm text-gray-900">
                  {selectedEvent.time || "TBD"}
                </p>
              </div>
              {selectedEvent.venue && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Venue
                  </label>
                  <p className="text-sm text-gray-900">{selectedEvent.venue}</p>
                </div>
              )}
              {selectedEvent.organizer && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Organizer
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEvent.organizer}
                  </p>
                </div>
              )}
            </div>

            {selectedEvent.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {selectedEvent.capacity && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                Capacity: {selectedEvent.capacity} participants
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentEvents;
