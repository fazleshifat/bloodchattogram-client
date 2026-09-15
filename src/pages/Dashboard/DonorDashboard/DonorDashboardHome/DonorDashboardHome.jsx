import React from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useRecentDonationRequests from "../useRecentDonationRequests ";
import useUserRole from "../../../../hooks/userUserRole";
import useAuth from "../../../../hooks/useAuth";
import Spinner from "../../../../components/Spinner";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaTint, FaArrowRight } from "react-icons/fa";

const DonorDashboardHome = () => {
    const { user } = useAuth();
    const { role } = useUserRole();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const {
        data: donationRequests = [],
        isLoading,
        refetch,
    } = useRecentDonationRequests();

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This donation request will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/donation-requests/${id}`);
                    Swal.fire("Deleted!", "Donation request has been deleted.", "success");
                    refetch();
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "Failed to delete request.", "error");
                }
            }
        });
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axiosSecure.patch(`/donation-requests/status/${id}`, { status });
            Swal.fire("Updated!", `Status changed to ${status}`, "success");
            refetch();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    if (isLoading) return <Spinner />;

    const statusColors = {
        pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
        inprogress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        done: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        canceled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Welcome Banner */}
            <div className="relative bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <span className="text-sm text-red-200 font-medium uppercase tracking-wider">{role} Dashboard</span>
                    <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-2">Welcome back, {user?.displayName}</h2>
                    <p className="text-red-100 text-sm">Here are your recent donation requests.</p>
                </div>
            </div>

            {/* Donation Requests */}
            {donationRequests.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Recent Requests</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{donationRequests.length} requests</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 text-left">#</th>
                                    <th className="px-6 py-3 text-left">Recipient</th>
                                    <th className="px-6 py-3 text-left">Location</th>
                                    <th className="px-6 py-3 text-center">Blood</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {donationRequests.slice(0, 3).map((req, index) => (
                                    <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{req.recipientName}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{req.recipientDistrict}, {req.recipientUpazila}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-xs">
                                                <FaTint className="text-[10px]" /> {req.bloodGroup}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{req.donationDate}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[req.donationStatus] || statusColors.pending}`}>
                                                {req.donationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => navigate(`/donation-details/${req._id}`)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View">
                                                    <FaEye className="text-sm" />
                                                </button>
                                                <button onClick={() => navigate(`/dashboard/edit-donation/${req._id}`)} className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Edit">
                                                    <FaEdit className="text-sm" />
                                                </button>
                                                <button onClick={() => handleDelete(req._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                                    <FaTrash className="text-sm" />
                                                </button>
                                                {req.donationStatus === "inprogress" && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(req._id, "done")} className="p-2 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Mark Done">
                                                            <FaCheck className="text-sm" />
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(req._id, "canceled")} className="p-2 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors" title="Cancel">
                                                            <FaTimes className="text-sm" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <FaTint className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No donation requests yet.</p>
                </div>
            )}

            {/* View All Button */}
            {donationRequests.length > 0 && (
                <div className="text-center">
                    <button
                        onClick={() => navigate("/dashboard/my-donation-requests")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl transition-all"
                    >
                        View All Requests <FaArrowRight className="text-sm" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DonorDashboardHome;
