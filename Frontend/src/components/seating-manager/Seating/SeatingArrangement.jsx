import React, { useState, useEffect } from "react";
import { useApiMutation } from "../../../hooks/useApi";
import api from "../../../services/api";
import Table from "../../common/UI/Table";
import Button from "../../common/UI/Button";
import Modal from "../../common/UI/Modal";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react"; // Added Trash2 import

const SeatingArrangement = () => {
  const [arrangements, setArrangements] = useState([]);
  const [exams, setExams] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewArrangement, setPreviewArrangement] = useState(null);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { mutate } = useApiMutation();

  useEffect(() => {
    fetchArrangements();
    fetchExams();
    fetchHalls();
  }, []);

  const fetchArrangements = async () => {
    try {
      const response = await api.get("/seating");
      setArrangements(response.data.data || []);
    } catch (error) {
      console.error("Error fetching arrangements:", error);
      toast.error("Failed to fetch arrangements");
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await api.get("/exams");
      // Backend returns exams array directly, not wrapped in data.data
      setExams(response.data?.data || response.data || []);
      console.log("Fetched exams:", response.data?.data || response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to fetch exams");
    }
  };

  const fetchHalls = async () => {
    try {
      const response = await api.get("/halls");
      setHalls(response.data.data || []);
    } catch (error) {
      console.error("Error fetching halls:", error);
      toast.error("Failed to fetch halls");
    }
  };

  const generateArrangement = async () => {
    if (!selectedExam || !selectedHall) {
      toast.error("Please select an exam and hall");
      return;
    }
    setGenerating(true);
    try {
      const result = await mutate("post", "/seating", {
        examId: selectedExam,
        hallId: selectedHall,
      });
      if (result.success) {
        toast.success("Seating arrangement generated successfully");
        fetchArrangements();
        setSelectedExam("");
        setSelectedHall("");
      }
    } catch (error) {
      console.error("Error generating arrangement:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate arrangement. Please check your permissions and try again.";
      toast.error(errorMsg);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this seating arrangement?")) {
        try {
            const result = await mutate("delete", `/seating/${id}`);
            if (result.success) {
                toast.success("Seating arrangement deleted successfully");
                fetchArrangements();
            } else {
                toast.error(result.message || "Failed to delete arrangement");
            }
        } catch (error) {
            console.error("Error deleting arrangement:", error);
            toast.error("Failed to delete arrangement");
        }
    }
  };

  const handlePreviewArrangement = async (arrangementId) => {
    try {
      const response = await api.get(`/seating/${arrangementId}`);
      setPreviewArrangement(response.data.data);
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Error fetching arrangement details:", error);
      toast.error("Failed to load arrangement details");
    }
  };

  const downloadArrangement = async (arrangementId) => {
    try {
      const response = await api.get(`/seating/${arrangementId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `seating-arrangement-${arrangementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading arrangement:", error);
      toast.error("Failed to download arrangement");
    }
  };

  const columns = [
    {
      key: "exam",
      label: "Exam",
      render: (value, arrangement) => arrangement.exam?.title || "N/A",
    },
    {
      key: "hall",
      label: "Hall",
      render: (value, arrangement) => arrangement.hall?.name || value || "N/A",
    },
    {
      key: "students",
      label: "Students",
      render: (value, arrangement) => arrangement.arrangements?.length || 0,
    },
    {
      key: "classes",
      label: "Classes/Groups",
      render: (value, arrangement) => {
        const classes = [
          ...new Set(arrangement.arrangements?.map((a) => a.class) || []),
        ];
        return classes.length;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value, arrangement) => arrangement.status || value || "Draft",
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, arrangement) => (
        <div className="space-x-2 flex">
          <Button
            onClick={() => handlePreviewArrangement(arrangement._id)}
            variant="outline"
            size="sm"
          >
            Preview
          </Button>
          {(arrangement.status === "Draft" || !arrangement.status) && (
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
          <Button
            onClick={() => handleDelete(arrangement._id)}
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
          >
             Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
          Seating Arrangements
        </h2>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={selectedExam}
            onChange={(e) => {
                const examId = e.target.value;
                setSelectedExam(examId);
                
                // Auto-select hall based on exam
                if (examId) {
                    const exam = exams.find(ex => ex._id === examId);
                    if (exam && exam.hall) {
                        const matchedHall = halls.find(h => h.name.toLowerCase() === exam.hall.toLowerCase());
                        if (matchedHall) {
                            setSelectedHall(matchedHall._id);
                        } else {
                            toast.error(`Hall "${exam.hall}" not found in system.`);
                            setSelectedHall("");
                        }
                    } else {
                        setSelectedHall("");
                    }
                } else {
                    setSelectedHall("");
                }
            }}
            className="border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-md px-3 py-2 flex-1 md:flex-none min-w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
            disabled={exams.length === 0}
          >
            <option value="">
              {exams.length === 0 ? "No exams available" : "Select Exam"}
            </option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title} - {new Date(exam.date).toLocaleDateString()}
              </option>
            ))}
          </select>
          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="border border-gray-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400 rounded-md px-3 py-2 flex-1 md:flex-none min-w-[200px] focus:outline-none cursor-not-allowed bg-gray-100 text-gray-500"
            disabled={true}
          >
            <option value="">
              {selectedHall ? "Hall Selected" : "Auto-selected from Exam"}
            </option>
            {halls.map((hall) => (
              <option key={hall._id} value={hall._id}>
                {hall.name} (Capacity: {hall.capacity})
              </option>
            ))}
          </select>
          <Button
            onClick={generateArrangement}
            disabled={generating || !selectedExam || !selectedHall}
            className="flex-1 md:flex-none"
          >
            {generating ? "Generating..." : "Generate Arrangement"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-600">
          Loading arrangements...
        </div>
      ) : arrangements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">No seating arrangements found</p>
          <p className="text-sm text-slate-500">
            Create a new arrangement by selecting an exam and hall above
          </p>
        </div>
      ) : (
        <Table columns={columns} data={arrangements} />
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Seating Arrangement Preview"
        size="xl"
      >
        {previewArrangement && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="space-y-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{previewArrangement.exam?.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {previewArrangement.hall?.name} • Capacity: {previewArrangement.hall?.capacity} • Total Students: {previewArrangement.arrangements?.length || 0}
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            viewMode === 'grid' 
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        Grid Map
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            viewMode === 'list' 
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        List View
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="overflow-x-auto pb-4">
                    <div className="min-w-[600px] flex flex-col items-center">
                         {/* Teacher Desk Area */}
                         <div className="mb-8 w-64 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-inner">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Teacher's Desk / Board</span>
                        </div>

                        {/* Grid */}
                         <div 
                            className="grid gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50"
                            style={{
                                gridTemplateColumns: `repeat(${Math.max(...(previewArrangement.arrangements?.map(a => a.column) || [1]), 1)}, minmax(80px, 1fr))`
                            }}
                        >
                            {Array.from({ length: Math.max(...(previewArrangement.arrangements?.map(a => a.row) || [1]), 1) }).map((_, rowIndex) => {
                                const rowNum = rowIndex + 1;
                                const cols = Math.max(...(previewArrangement.arrangements?.map(a => a.column) || [1]), 1);
                                
                                return Array.from({ length: cols }).map((_, colIndex) => {
                                    const colNum = colIndex + 1;
                                    const seatData = previewArrangement.arrangements?.find(
                                        a => a.row === rowNum && a.column === colNum
                                    );

                                    return (
                                        <div 
                                            key={`${rowNum}-${colNum}`}
                                            className={`
                                                relative p-3 rounded-lg border-2 text-center transition-all group
                                                ${seatData 
                                                    ? 'bg-white dark:bg-slate-700 border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-md' 
                                                    : 'bg-slate-50 dark:bg-slate-800/50 border-dashed border-slate-200 dark:border-slate-700 opacity-50'
                                                }
                                            `}
                                        >
                                            {seatData ? (
                                                <>
                                                 <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                                                    {seatData.seatNumber}
                                                 </div>
                                                 <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full" title={seatData.studentRollNumber}>
                                                    {seatData.studentRollNumber || 'N/A'}
                                                 </div>
                                                 
                                                 {/* Hover Tooltip */}
                                                 <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-xs rounded-md p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    <p className="font-bold">{seatData.studentName}</p>
                                                    <p className="text-slate-300">{seatData.studentRollNumber}</p>
                                                    <p className="text-slate-300 mt-1">{seatData.class}</p>
                                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                                                 </div>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-300 dark:text-slate-600">Empty</span>
                                            )}
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden border-slate-200 dark:border-slate-700">
                    <div className="max-h-96 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0">
                            <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                Seat No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                Student Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                Roll Number
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                Class
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                Row/Col
                            </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                            {previewArrangement.arrangements?.map(
                            (arrangement, index) => (
                                <tr
                                key={index}
                                className={
                                    index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-800/50"
                                }
                                >
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-300 font-medium">
                                    {arrangement.seatNumber}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-300">
                                    {arrangement.studentName}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-300">
                                    {arrangement.studentRollNumber || "N/A"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-300">
                                    {arrangement.class}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-300">
                                    R{arrangement.row} : C{arrangement.column}
                                </td>
                                </tr>
                            )
                            )}
                        </tbody>
                        </table>
                    </div>
                </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SeatingArrangement;
