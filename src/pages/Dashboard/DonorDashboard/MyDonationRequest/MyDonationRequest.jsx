import React, { useEffect, useState } from 'react';
import useAuth from '../../../../hooks/useAuth';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router';
import useRecentDonationRequests from '../useRecentDonationRequests ';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaTint, FaPlusCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MyDonationRequests = () => {
    const { user } = useAuth();
    const userEmail = user?.email;
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const {
        data: donationRequests = [],
        isLoading,
        refetch,
    } = useRecentDonationRequests();

    const myRequests = donationRequests.filter(req => req.requesterEmail === userEmail);

    useEffect(() => {
        let result = [...myRequests];
        if (selectedStatus !== 'all') {
            result = result?.filter(req => req?.donationStatus === selectedStatus);
        }
        setFilteredRequests(result);
        setCurrentPage(1);
    }, [selectedStatus, donationRequests]);

    const totalItems = filteredRequests.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
            axiosSecure.patch(`/my-donation-requests/${status}/${id}`, { status });
            Swal.fire("Updated!", `Status changed to ${status}`, "success");
            refetch();
        } catch (err) {
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | My Donation Request";
    }, []);

    if (isLoading) return <Spinner />;

    const statusColors = {
        pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
        inprogress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        done: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };

    const filterColors = {
        all: 'from-gray-600 to-gray-500',
        pending: 'from-amber-500 to-amber-600',
        inprogress: 'from-blue-500 to-blue-600',
        done: 'from-green-500 to-green-600',
        cancelled: 'from-red-500 to-red-600',
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Donation Requests</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{myRequests.length} total requests</p>
                </div>
                <Link
                    to="/dashboard/create-donation-request"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all"
                >
                    <FaPlusCircle className="text-sm" /> New Request
                </Link>
            </div>

            {/* Filter Tabs */}
            {donationRequests.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'inprogress', 'done', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 ${selectedStatus === status
                                ? `bg-gradient-to-r ${filterColors[status]} text-white shadow-md`
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
            )}

            {/* Table */}
            {donationRequests.length > 0 ? (
                filteredRequests.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left">#</th>
                                        <th className="px-6 py-3 text-left">Recipient</th>
                                        <th className="px-6 py-3 text-left">Location</th>
                                        <th className="px-6 py-3 text-center">Blood</th>
                                        <th className="px-6 py-3 text-left">Date & Time</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-left">Donor Info</th>
                                        <th className="px-6 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {paginatedRequests.map((req, index) => (
                                        <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{req.recipientName}</td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{req.recipientDistrict}, {req.recipientUpazila}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-xs">
                                                    <FaTint className="text-[10px]" /> {req.bloodGroup}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                                <p>{req.donationDate}</p>
                                                <p className="text-gray-400">{req.donationTime}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[req.donationStatus] || statusColors.pending}`}>
                                                    {req.donationStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.donationStatus === "inprogress" ? (
                                                    <div className="text-xs">
                                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{req?.donorName}</p>
                                                        <p className="text-gray-400">{req?.donorEmail}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">N/A</span>
                                                )}
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
                                                            <button onClick={() => handleStatusUpdate(req._id, "done")} className="p-2 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Done">
                                                                <FaCheck className="text-sm" />
                                                            </button>
                                                            <button onClick={() => handleStatusUpdate(req._id, "cancelled")} className="p-2 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors" title="Cancel">
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
                        <FaTint className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No requests match the selected filter.</p>
                    </div>
                )
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <FaTint className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't created any donation requests yet.</p>
                    <Link to='/dashboard/create-donation-request' className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all">
                        <FaPlusCircle /> Create Request
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all"
                    >
                        <FaChevronLeft className="text-xs" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === i + 1
                                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md'
                                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all"
                    >
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;
