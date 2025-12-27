import React, { useState } from "react";
import { motion } from "framer-motion";
import { useApi, useApiMutation } from "../../../hooks/useApi";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Heart,
  Info,
  CalendarCheck,
} from "lucide-react";

const StudentEvents = () => {
  const { user } = useAuth();
  const { data: eventsData, loading } = useApi("/events");
  const { mutate } = useApiMutation();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [localEvents, setLocalEvents] = useState([]);

  React.useEffect(() => {
    if (eventsData?.data) {
      setLocalEvents(eventsData.data);
    }
  }, [eventsData]);

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const getEventTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "cultural":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "technical":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "sports":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      case "academic":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800";
    }
  };

  const getEventGradient = (type) => {
    switch (type?.toLowerCase()) {
      case "cultural":
        return "from-purple-500 to-pink-500";
      case "technical":
        return "from-blue-500 to-cyan-500";
      case "sports":
        return "from-green-500 to-emerald-500";
      case "academic":
        return "from-amber-500 to-orange-500";
      default:
        return "from-slate-500 to-gray-500";
    }
  };

  const handleToggleInterest = async (eventId) => {
    setLocalEvents((prev) =>
      prev.map((ev) => {
        if (ev._id === eventId) {
          const userId = user?.id || user?._id;
          const isInterested = ev.interestedUsers?.includes(userId);
          let newInterestedUsers = [...(ev.interestedUsers || [])];
          if (isInterested) {
            newInterestedUsers = newInterestedUsers.filter(
              (id) => id !== userId
            );
          } else {
            newInterestedUsers.push(userId);
          }
          return { ...ev, interestedUsers: newInterestedUsers };
        }
        return ev;
      })
    );

    try {
      await mutate("post", `/events/${eventId}/interest`);
    } catch (error) {
      console.error("Failed to toggle interest", error);
    }
  };

  if (loading && localEvents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-slate-700 rounded-2xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const events = localEvents;

  return (
    <div className="space-y-8">
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Decorative top bar */}
              <div
                className={`h-2 w-full bg-gradient-to-r ${getEventGradient(
                  event.type
                )}`}
              />

              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div
                      className={`p-3.5 rounded-2xl bg-gradient-to-br ${getEventGradient(
                        event.type
                      )} bg-opacity-10 text-white shadow-lg`}
                    >
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2 line-clamp-1">
                        {event.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type}
                      </span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleInterest(event._id);
                    }}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      event.interestedUsers?.includes(user?.id || user?._id)
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                        : "bg-slate-100 dark:bg-slate-700/50 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        event.interestedUsers?.includes(user?.id || user?._id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  </motion.button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    <Calendar className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                    <span className="font-medium">
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                    {event.time || "TBD"}
                  </div>
                  {event.venue && (
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <MapPin className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                      {event.venue}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleViewEvent(event)}
                  className="w-full bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 mb-6">
            <Calendar className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No Events Found
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Stay tuned! New events will appear here soon.
          </p>
        </div>
      )}

      {/* Modern Event Details Modal - Optimized for No Scroll */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <div className="relative">
            {/* Compact Header Banner */}
            <div
              className={`absolute -top-6 -left-6 -right-6 h-24 bg-gradient-to-r ${getEventGradient(
                selectedEvent.type
              )} opacity-10`}
            />

            <div className="relative pt-2">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getEventTypeColor(
                        selectedEvent.type
                      )}`}
                    >
                      {selectedEvent.type}
                    </span>
                    {selectedEvent.interestedUsers?.includes(
                      user?.id || user?._id
                    ) && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-rose-500">
                        <Heart className="h-3 w-3 fill-current" />
                        Interested
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedEvent.title}
                  </h2>
                </div>
                <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${getEventGradient(
                        selectedEvent.type
                    )} text-white shadow-lg transform rotate-3 hidden sm:block`}
                >
                    <Trophy className="h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                       <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                          <CalendarCheck className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date & Time</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {new Date(selectedEvent.date).toLocaleDateString("en-GB", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })} • {selectedEvent.time || "TBD"}
                          </p>
                       </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                       <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-pink-600 dark:text-pink-400">
                          <MapPin className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Venue</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-[180px]">
                            {selectedEvent.venue || "TBA"}
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                          Organizer
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white text-sm line-clamp-1">
                          {selectedEvent.organizer?.name || selectedEvent.organizer || "N/A"}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                          Capacity
                        </span>
                        <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white text-sm">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {selectedEvent.capacity || "Unlimited"}
                        </div>
                      </div>
                  </div>
                </div>

                {/* Right Column: Description */}
                <div className="flex flex-col h-full">
                   <h4 className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    <Info className="h-3.5 w-3.5" /> Description
                  </h4>
                  <div className="flex-1 p-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm leading-relaxed shadow-sm overflow-y-auto max-h-[200px] custom-scrollbar">
                    {selectedEvent.description ||
                      "No detailed description provided for this event."}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 pt-5 border-t border-slate-100 dark:border-slate-700">
                <Button
                  onClick={async (e) => {
                      e.stopPropagation();
                      await handleToggleInterest(selectedEvent._id);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 ${
                    localEvents.find((e) => e._id === selectedEvent._id)
                      ?.interestedUsers?.includes(user?.id || user?._id)
                      ? "bg-rose-500 hover:bg-rose-600 text-white border-transparent"
                      : "bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white border-slate-200 dark:border-slate-600"
                  }`}
                  variant={localEvents.find(e => e._id === selectedEvent._id)?.interestedUsers?.includes(user?.id || user?._id) ? "primary" : "outline"}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      localEvents.find((e) => e._id === selectedEvent._id)
                        ?.interestedUsers?.includes(user?.id || user?._id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                  {localEvents.find((e) => e._id === selectedEvent._id)
                    ?.interestedUsers?.includes(user?.id || user?._id)
                    ? "Interested"
                    : "Mark Interest"}
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-10"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentEvents;
