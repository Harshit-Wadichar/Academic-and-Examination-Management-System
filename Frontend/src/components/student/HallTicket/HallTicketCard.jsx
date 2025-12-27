import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const HallTicketCard = ({ hallTicket }) => {
  const [downloading, setDownloading] = useState(false);
  const { apiCall } = useApi();
  const { user } = useAuth();

  const downloadHallTicket = async () => {
    // Validation: Check if profile is complete
    if (!user?.course || !user?.department || !user?.rollNumber) {
        toast.error("Please complete your profile (Course, Department, Roll Number) to download the Hall Ticket.");
        return;
    }

    // Check for profile picture
    if (!user?.profilePicture) {
        toast.error("Set profile image in order to get the hall ticket");
        return;
    }

    setDownloading(true);
    try {
      const response = await apiCall(
        `/halltickets/${hallTicket._id}/download`,
        "GET",
        null,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hall-ticket-${hallTicket.exam.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading hall ticket:", error);
      toast.error("Failed to download hall ticket");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 relative overflow-hidden">
      {hallTicket.approvalStatus === 'approved' && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-sm flex items-center gap-1 z-10">
            <CheckCircle size={12} />
            APPROVED
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">Hall Ticket</h3>
        {/* Profile Image Display */}
        {user?.profilePicture ? (
             <img 
                src={user.profilePicture} 
                alt="Student Profile" 
                className="w-20 h-20 rounded-md object-cover border border-slate-200 shadow-sm"
             />
        ) : (
            <div className="w-20 h-20 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-center p-1 text-slate-400">
                No Photo
            </div>
        )}
      </div>

      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Course:</span> {user?.course || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Semester:</span> {user?.semester || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Exam:</span> {hallTicket.exam?.title}
        </p>
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(hallTicket.exam?.date).toLocaleDateString("en-GB")}
        </p>
        <p>
          <span className="font-semibold">Time:</span> {hallTicket.exam?.time}
        </p>
        <p>
          <span className="font-semibold">Venue:</span> {hallTicket.exam?.venue}
        </p>
        <p>
          <span className="font-semibold">Seat Number:</span>{" "}
          {hallTicket.seatNumber}
        </p>
      </div>
      <button
        onClick={downloadHallTicket}
        disabled={downloading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {downloading ? "Downloading..." : "Download Hall Ticket"}
      </button>
    </div>
  );
};

export default HallTicketCard;
