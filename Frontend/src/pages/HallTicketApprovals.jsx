import React, { useState, useEffect } from "react";
import { Check, X, Filter, Search } from "lucide-react";
import { useApi, useApiMutation } from "../hooks/useApi";
import { toast } from "react-hot-toast";

const HallTicketApprovals = () => {
    const [statusFilter, setStatusFilter] = useState("pending");
    const { data: tickets, loading, refetch } = useApi(`/halltickets/admin/all?status=${statusFilter}`);
    const { mutate, loading: processing } = useApiMutation();

    const handleStatusUpdate = async (id, status, currentRejectionReason = "") => {
        let rejectionReason = "";
        if (status === "rejected") {
            rejectionReason = window.prompt("Enter rejection reason:", "Incomplete requirements");
            if (rejectionReason === null) return; // Cancelled
        }

        const res = await mutate("put", `/halltickets/${id}/status`, { status, rejectionReason });
        if (res.success) {
            toast.success(`Hall ticket ${status} successfully`);
            refetch();
        } else {
            toast.error(res.error || "Failed to update status");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hall Ticket Approvals</h1>
                <div className="flex gap-2">
                    {['pending', 'approved', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg capitalize ${
                                statusFilter === status 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Student</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Exam</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Details</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {tickets?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No hall tickets found with status: {statusFilter}
                                    </td>
                                </tr>
                            ) : (
                                tickets?.data?.map((ticket) => (
                                    <tr key={ticket._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800 dark:text-white">{ticket.student?.name}</div>
                                            <div className="text-sm text-gray-500">{ticket.student?.rollNumber}</div>
                                            <div className="text-xs text-gray-400">{ticket.student?.department} - Sem {ticket.student?.semester}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800 dark:text-white">{ticket.exam?.title}</div>
                                            <div className="text-sm text-gray-500">
                                                {ticket.exam?.date && new Date(ticket.exam?.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">Hall: {ticket.hall}</div>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">Seat: {ticket.seatNumber}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                                                ${ticket.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                                                  ticket.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {ticket.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {ticket.approvalStatus === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(ticket._id, 'approved')}
                                                        disabled={processing}
                                                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(ticket._id, 'rejected')}
                                                        disabled={processing}
                                                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default HallTicketApprovals;
