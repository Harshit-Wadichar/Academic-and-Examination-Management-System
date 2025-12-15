import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";

const SeatingArrangement = () => {
  const [arrangements, setArrangements] = useState([]);
  const [exams, setExams] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { apiCall } = useApi();

  useEffect(() => {
    fetchArrangements();
    fetchExams();
    fetchHalls();
  }, []);

  const fetchArrangements = async () => {
    try {
      // TODO: Implement actual API call using useApi hook
      const response = await apiCall("/seating", "GET");
      setArrangements(response.data);
    } catch (error) {
      console.error("Error fetching arrangements:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      // TODO: Implement actual API call using useApi hook
      const response = await apiCall("/exams", "GET");
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const fetchHalls = async () => {
    try {
      // TODO: Implement actual API call using useApi hook
      const response = await apiCall("/halls", "GET");
      setHalls(response.data);
    } catch (error) {
      console.error("Error fetching halls:", error);
    }
  };

  const generateArrangement = async (examId, hallId) => {
    setGenerating(true);
    try {
      // TODO: Implement actual API call using useApi hook
      await apiCall("/seating", "POST", { examId, hallId });
      fetchArrangements();
    } catch (error) {
      console.error("Error generating arrangement:", error);
    } finally {
      setGenerating(false);
    }
  };

  const finalizeArrangement = async (arrangementId) => {
    try {
      // TODO: Implement actual API call using useApi hook
      await apiCall(`/seating/${arrangementId}/finalize`, "PUT");
      fetchArrangements();
    } catch (error) {
      console.error("Error finalizing arrangement:", error);
    }
  };

  const downloadArrangement = async (arrangementId) => {
    try {
      // TODO: Implement actual API call using useApi hook
      const response = await apiCall(
        `/seating/${arrangementId}/download`,
        "GET",
        null,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `seating-arrangement-${arrangementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading arrangement:", error);
    }
  };

  const columns = [
    {
      key: "exam",
      label: "Exam",
      render: (arrangement) => arrangement.exam?.title,
    },
    { key: "hall", label: "Hall" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (arrangement) => (
        <div className="space-x-2">
          {arrangement.status === "Draft" && (
            <Button
              onClick={() => finalizeArrangement(arrangement._id)}
              variant="primary"
              size="sm"
            >
              Finalize
            </Button>
          )}
          <Button
            onClick={() => downloadArrangement(arrangement._id)}
            variant="secondary"
            size="sm"
          >
            Download
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Seating Arrangements
        </h2>
        <div className="space-x-2">
          <select className="border border-gray-300 rounded-md px-3 py-2">
            <option>Select Exam</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title}
              </option>
            ))}
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2">
            <option>Select Hall</option>
            {halls.map((hall) => (
              <option key={hall._id} value={hall._id}>
                {hall.name}
              </option>
            ))}
          </select>
          <Button
            onClick={() => generateArrangement("examId", "hallId")}
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate Arrangement"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading arrangements...</div>
      ) : (
        <Table columns={columns} data={arrangements} />
      )}
    </div>
  );
};

export default SeatingArrangement;
