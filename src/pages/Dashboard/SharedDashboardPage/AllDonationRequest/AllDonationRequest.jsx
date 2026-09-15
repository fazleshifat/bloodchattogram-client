import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import useUserRole from '../../../../hooks/userUserRole';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaTint, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const statuses = ['pending', 'inprogress', 'done', 'cancelled'];

const AllDonationRequests = () => {
    const axiosSecure = useAxiosSecure();
    const { role } = useUserRole();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();
    const limit = 10;

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Dropvein | All Donation Request';
    }, []);

    const { data: donationRequests = { data: [], total: 0 }, isLoading, refetch } = useQuery({
        queryKey: ['donationRequests', currentPage, filterStatus],
        queryFn: async () => {
            const statusQuery = filterStatus !== 'all' ? `&status=${filterStatus}` : '';
            const res = await axiosSecure.get(`/donation-requests?page=${currentPage}&limit=${limit}${statusQuery}`);
            return res.data;
        }
    });

    const { mutate: updateStatus } = useMutation({
        mutationFn: async ({ id, status }) => axiosSecure.patch(`/donation-requests/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['donationRequests']);
            Swal.fire('Updated!', 'Donation status has been updated.', 'success');
        },
        onError: () => Swal.fire('Error', 'Could not update status', 'error')
    });

    const needActionForVolunteer = useMemo(() => {
        return donationRequests?.data?.some(req => req.donationStatus === 'inprogress');
    }, [donationRequests]);

    const handleStatusChangeByAdmin = (id, status) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Change status to ${status}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, update!'
        }).then((result) => {
            if (result.isConfirmed) updateStatus({ id, status });
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This donation request will be deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/donation-requests/${id}`);
                    Swal.fire('Deleted!', 'Donation request has been deleted.', 'success');
                    refetch();
                } catch (err) {
                    Swal.fire('Error', 'Failed to delete request.', 'error');
                }
            }
        });
    };

    const handleStatusUpdateAfterInprogress = async (id, status) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Mark this request as ${status}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, mark as ${status}`,
            confirmButtonColor: status === 'done' ? '#16a34a' : '#d97706',
            cancelButtonColor: '#6b7280',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/my-donation-requests/${status}/${id}`, { status });
                    Swal.fire('Updated!', `Status changed to ${status}`, 'success');
                    queryClient.invalidateQueries(['donationRequests']);
                } catch (err) {
                    Swal.fire('Error', 'Failed to update status.', 'error');
                }
            }
        });
    };

    const total = donationRequests?.total || 0;
    const totalPages = Math.ceil(total / limit);

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
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Blood Donation Requests</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} total requests</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {['all', ...statuses].map(status => (
                    <button
                        key={status}
                        onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 ${filterStatus === status
                            ? `bg-gradient-to-r ${filterColors[status]} text-white shadow-md`
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {status === 'all' ? 'All' : status}
                    </button>
                ))}
            </div>

            {/* Table or Empty */}
            {donationRequests?.data?.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <FaTint className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        {filterStatus === 'all' ? 'No donation requests found.' : `No "${filterStatus}" requests found.`}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Recipient</th>
                                    <th className="px-4 py-3 text-center">Blood</th>
                                    <th className="px-4 py-3 text-left">Location</th>
                                    <th className="px-4 py-3 text-left">Requester</th>
                                    <th className="px-4 py-3 text-left">Donor</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    {role === 'admin' && <th className="px-4 py-3 text-center">Update</th>}
                                    {(role === 'admin' || (role === 'volunteer' && needActionForVolunteer)) && (
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {donationRequests.data.map((req, index) => (
                                    <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * limit + index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{req.recipientName}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-xs">
                                                <FaTint className="text-[10px]" /> {req.bloodGroup}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{req.recipientDistrict}, {req.recipientUpazila}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{req.requesterName}</td>
                                        <td className="px-4 py-3 text-xs">
                                            {req.donorName ? (
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200">{req.donorName}</p>
                                                    <p className="text-gray-400">{req.donorEmail}</p>
                                                </div>
                                            ) : <span className="text-gray-400">N/A</span>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{req.donationDate}<br />{req.donationTime}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[req.donationStatus] || statusColors.pending}`}>
                                                {req.donationStatus}
                                            </span>
                                        </td>

                                        {role === 'admin' && (
                                            <td className="px-4 py-3 text-center">
                                                <select
                                                    value={req.donationStatus}
                                                    onChange={(e) => handleStatusChangeByAdmin(req._id, e.target.value)}
                                                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 dark:focus:ring-red-900/30 text-gray-700 dark:text-gray-300"
                                                >
                                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </td>
                                        )}

                                        {(role === 'admin' || role === 'volunteer') && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    {role === 'admin' && (
                                                        <>
                                                            <button onClick={() => navigate(`/donation-details/${req._id}`)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View">
                                                                <FaEye className="text-sm" />
                                                            </button>
                                                            <button onClick={() => navigate(`/dashboard/edit-donation/${req._id}`)} className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Edit">
                                                                <FaEdit className="text-sm" />
                                                            </button>
                                                            <button onClick={() => handleDelete(req._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                                                <FaTrash className="text-sm" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {req.donationStatus === 'inprogress' && (
                                                        <>
                                                            <button onClick={() => handleStatusUpdateAfterInprogress(req._id, 'done')} className="p-2 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Done">
                                                                <FaCheck className="text-sm" />
                                                            </button>
                                                            <button onClick={() => handleStatusUpdateAfterInprogress(req._id, 'cancelled')} className="p-2 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors" title="Cancel">
                                                                <FaTimes className="text-sm" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all">
                        <FaChevronLeft className="text-xs" />
                    </button>
                    {[...Array(totalPages).keys()].map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page + 1)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === page + 1
                                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md'
                                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {page + 1}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all">
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllDonationRequests;
