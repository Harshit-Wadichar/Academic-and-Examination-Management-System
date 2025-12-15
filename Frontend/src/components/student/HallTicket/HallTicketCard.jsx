import React, { useState } from "react";
import { useApi } from "../../hooks/useApi";

const HallTicketCard = ({ hallTicket }) => {
  const [downloading, setDownloading] = useState(false);
  const { apiCall } = useApi();

  const downloadHallTicket = async () => {
    setDownloading(true);
    try {
      // TODO: Implement actual API call using useApi hook
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
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Hall Ticket</h3>
      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Exam:</span> {hallTicket.exam?.title}
        </p>
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(hallTicket.exam?.date).toLocaleDateString()}
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
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? "Downloading..." : "Download Hall Ticket"}
      </button>
    </div>
  );
};

export default HallTicketCard;
