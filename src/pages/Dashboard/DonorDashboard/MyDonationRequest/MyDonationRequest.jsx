import React, { useEffect, useState } from 'react';
import useAuth from '../../../../hooks/useAuth';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router';
import useRecentDonationRequests from '../useRecentDonationRequests ';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import {
    FaEye,
    FaEdit,
    FaTrash,
    FaCheck,
    FaTimes,
    FaTint,
    FaPlusCircle,
    FaChevronLeft,
    FaChevronRight,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaHeart,
    FaArrowRight,
    FaCircle
} from 'react-icons/fa';

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

    const myRequests = donationRequests.filter(
        req => req.requesterEmail === userEmail
    );

    useEffect(() => {
        let result = [...myRequests];

        if (selectedStatus !== 'all') {
            result = result.filter(
                req => req?.donationStatus === selectedStatus
            );
        }

        setFilteredRequests(result);
        setCurrentPage(1);
    }, [selectedStatus, donationRequests]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | My Donation Request";
    }, []);

    const totalItems = filteredRequests.length;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const pendingCount = myRequests.filter(
        req => req.donationStatus === 'pending'
    ).length;

    const progressCount = myRequests.filter(
        req => req.donationStatus === 'inprogress'
    ).length;

    const completedCount = myRequests.filter(
        req => req.donationStatus === 'done'
    ).length;

    const cancelledCount = myRequests.filter(
        req => req.donationStatus === 'cancelled'
    ).length;

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete donation request?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Keep request",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/donation-requests/${id}`);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Donation request has been deleted.",
                        icon: "success",
                        confirmButtonColor: "#dc2626",
                    });

                    refetch();
                } catch (err) {
                    console.error(err);

                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete request.",
                        icon: "error",
                        confirmButtonColor: "#dc2626",
                    });
                }
            }
        });
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axiosSecure.patch(
                `/my-donation-requests/${status}/${id}`,
                { status }
            );

            Swal.fire({
                title: "Updated!",
                text: `Status changed to ${status}.`,
                icon: "success",
                confirmButtonColor: "#dc2626",
            });

            refetch();
        } catch (err) {
            console.error(err);

            Swal.fire({
                title: "Error",
                text: "Failed to update status.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    if (isLoading) return <Spinner />;

    const statusConfig = {
        pending: {
            label: 'Pending',
            dot: 'bg-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            text: 'text-amber-700 dark:text-amber-400',
            border: 'border-amber-200 dark:border-amber-800/40',
        },
        inprogress: {
            label: 'In Progress',
            dot: 'bg-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-700 dark:text-blue-400',
            border: 'border-blue-200 dark:border-blue-800/40',
        },
        done: {
            label: 'Completed',
            dot: 'bg-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            text: 'text-emerald-700 dark:text-emerald-400',
            border: 'border-emerald-200 dark:border-emerald-800/40',
        },
        cancelled: {
            label: 'Cancelled',
            dot: 'bg-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-700 dark:text-red-400',
            border: 'border-red-200 dark:border-red-800/40',
        },
    };

    const filterConfig = [
        {
            key: 'all',
            label: 'All Requests',
            count: myRequests.length,
        },
        {
            key: 'pending',
            label: 'Pending',
            count: pendingCount,
        },
        {
            key: 'inprogress',
            label: 'In Progress',
            count: progressCount,
        },
        {
            key: 'done',
            label: 'Completed',
            count: completedCount,
        },
        {
            key: 'cancelled',
            label: 'Cancelled',
            count: cancelledCount,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">

            {/* =====================================================
                HERO HEADER
            ====================================================== */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-rose-500 p-6 sm:p-8 lg:p-10 text-white shadow-2xl shadow-red-500/20">

                {/* Decorative circles */}
                <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-sm" />
                <div className="absolute -bottom-28 right-20 h-72 w-72 rounded-full bg-white/5" />
                <div className="absolute left-1/2 top-0 h-40 w-40 rounded-full bg-red-400/10 blur-3xl" />

                {/* Blood drop decoration */}
                <div className="absolute right-8 top-8 hidden sm:block opacity-10">
                    <FaTint className="text-[180px]" />
                </div>

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    <div className="max-w-2xl">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                            <FaHeart className="text-red-100" />
                            Your Blood Mission
                        </div>

                        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
                            My Donation Requests
                        </h1>

                        <p className="mt-2 max-w-xl text-xs leading-5 text-red-50 sm:text-sm">
                            Track your blood requests, monitor donor activity,
                            and manage every life-saving mission.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm">

                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                                    <FaUsers />
                                </span>
                                <span>
                                    <strong className="font-bold">
                                        {myRequests.length}
                                    </strong>{' '}
                                    total requests
                                </span>
                            </div>

                            <div className="h-5 w-px bg-white/20" />

                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                                    <FaTint />
                                </span>
                                <span>
                                    <strong className="font-bold">
                                        {completedCount}
                                    </strong>{' '}
                                    completed
                                </span>
                            </div>

                        </div>
                    </div>

                    <Link
                        to="/dashboard/create-donation-request"
                        className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-red-600 shadow-xl shadow-red-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-auto"
                    >
                        <FaPlusCircle />
                        Create New Request
                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                </div>
            </section>


            {/* =====================================================
                STATISTICS
            ====================================================== */}
            <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <FaTint />
                        </div>
                        <span className="text-2xl font-black text-slate-800 dark:text-white">
                            {myRequests.length}
                        </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Total Requests
                    </p>
                </div>

                <div className="group rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-amber-900/30 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-900/20">
                            <FaClock />
                        </div>
                        <span className="text-2xl font-black text-slate-800 dark:text-white">
                            {pendingCount}
                        </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Waiting
                    </p>
                </div>

                <div className="group rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-blue-900/30 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-900/20">
                            <FaUsers />
                        </div>
                        <span className="text-2xl font-black text-slate-800 dark:text-white">
                            {progressCount}
                        </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        In Progress
                    </p>
                </div>

                <div className="group rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-emerald-900/30 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20">
                            <FaCheck />
                        </div>
                        <span className="text-2xl font-black text-slate-800 dark:text-white">
                            {completedCount}
                        </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Completed
                    </p>
                </div>

            </section>


            {/* =====================================================
                FILTER BAR
            ====================================================== */}
            {myRequests.length > 0 && (
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">

                        {filterConfig.map(filter => {

                            const active = selectedStatus === filter.key;

                            return (
                                <button
                                    key={filter.key}
                                    onClick={() => setSelectedStatus(filter.key)}
                                    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${active
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                        }`}
                                >
                                    {filter.label}

                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] ${active
                                                ? 'bg-white/20 text-white'
                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                            }`}
                                    >
                                        {filter.count}
                                    </span>
                                </button>
                            );
                        })}

                    </div>
                </section>
            )}


            {/* =====================================================
                REQUESTS
            ====================================================== */}
            <section className="mt-6">

                {myRequests.length > 0 ? (

                    filteredRequests.length > 0 ? (

                        <div className="space-y-4">

                            {/* Desktop Table */}
                            <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">

                                <div className="overflow-x-auto">

                                    <table className="w-full text-sm">

                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/50">

                                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Request
                                                </th>

                                                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Location
                                                </th>

                                                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Blood
                                                </th>

                                                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Schedule
                                                </th>

                                                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Status
                                                </th>

                                                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Donor
                                                </th>

                                                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Actions
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                                            {paginatedRequests.map((req, index) => {

                                                const status =
                                                    statusConfig[
                                                    req.donationStatus
                                                    ] ||
                                                    statusConfig.pending;

                                                return (
                                                    <tr
                                                        key={req._id}
                                                        className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-950/40"
                                                    >

                                                        {/* Request */}
                                                        <td className="px-6 py-5">

                                                            <div className="flex items-center gap-3">

                                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                                    <FaTint />
                                                                </div>

                                                                <div className="min-w-0">

                                                                    <p className="truncate font-bold text-slate-800 dark:text-white">
                                                                        {req.recipientName}
                                                                    </p>

                                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                                        Request #
                                                                        {(currentPage - 1) * itemsPerPage +
                                                                            index +
                                                                            1}
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* Location */}
                                                        <td className="px-4 py-5">

                                                            <div className="flex items-start gap-2">

                                                                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-xs text-red-400" />

                                                                <div>
                                                                    <p className="font-medium text-slate-700 dark:text-slate-300">
                                                                        {req.recipientDistrict}
                                                                    </p>

                                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                                        {req.recipientUpazila}
                                                                    </p>
                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* Blood */}
                                                        <td className="px-4 py-5">

                                                            <div className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 dark:border-red-900/30 dark:bg-red-900/20">

                                                                <FaTint className="text-xs text-red-500" />

                                                                <span className="font-black text-red-600 dark:text-red-400">
                                                                    {req.bloodGroup}
                                                                </span>

                                                            </div>

                                                        </td>


                                                        {/* Schedule */}
                                                        <td className="px-4 py-5">

                                                            <div className="space-y-1">

                                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                                    <FaCalendarAlt className="text-[10px] text-slate-400" />
                                                                    {req.donationDate}
                                                                </div>

                                                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                                    <FaClock className="text-[10px]" />
                                                                    {req.donationTime}
                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* Status */}
                                                        <td className="px-4 py-5">

                                                            <span
                                                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${status.bg} ${status.text} ${status.border}`}
                                                            >
                                                                <FaCircle className={`text-[6px] ${status.dot}`} />
                                                                {status.label}
                                                            </span>

                                                        </td>


                                                        {/* Donor */}
                                                        <td className="px-4 py-5">

                                                            {req.donationStatus === "inprogress" ? (

                                                                <div className="max-w-[170px]">

                                                                    <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
                                                                        {req?.donorName || 'Assigned donor'}
                                                                    </p>

                                                                    <p className="truncate text-[10px] text-slate-400">
                                                                        {req?.donorEmail}
                                                                    </p>

                                                                </div>

                                                            ) : (

                                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 dark:bg-slate-800">
                                                                    <FaUsers />
                                                                    No donor yet
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* Actions */}
                                                        <td className="px-6 py-5">

                                                            <div className="flex items-center justify-center gap-1">

                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/donation-details/${req._id}`
                                                                        )
                                                                    }
                                                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-blue-500 transition-all hover:bg-blue-50 hover:shadow-sm dark:hover:bg-blue-900/20"
                                                                    title="View"
                                                                >
                                                                    <FaEye className="text-xs" />
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/dashboard/edit-donation/${req._id}`
                                                                        )
                                                                    }
                                                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-emerald-500 transition-all hover:bg-emerald-50 hover:shadow-sm dark:hover:bg-emerald-900/20"
                                                                    title="Edit"
                                                                >
                                                                    <FaEdit className="text-xs" />
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(req._id)
                                                                    }
                                                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-all hover:bg-red-50 hover:shadow-sm dark:hover:bg-red-900/20"
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash className="text-xs" />
                                                                </button>

                                                                {req.donationStatus === "inprogress" && (
                                                                    <>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    req._id,
                                                                                    "done"
                                                                                )
                                                                            }
                                                                            className="flex h-9 w-9 items-center justify-center rounded-xl text-emerald-500 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                                            title="Mark as completed"
                                                                        >
                                                                            <FaCheck className="text-xs" />
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleStatusUpdate(
                                                                                    req._id,
                                                                                    "cancelled"
                                                                                )
                                                                            }
                                                                            className="flex h-9 w-9 items-center justify-center rounded-xl text-amber-500 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                                                            title="Cancel request"
                                                                        >
                                                                            <FaTimes className="text-xs" />
                                                                        </button>
                                                                    </>
                                                                )}

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            })}

                                        </tbody>

                                    </table>

                                </div>

                            </div>


                            {/* =====================================================
                                MOBILE / TABLET CARDS
                            ====================================================== */}
                            <div className="grid gap-4 lg:hidden">

                                {paginatedRequests.map((req, index) => {

                                    const status =
                                        statusConfig[
                                        req.donationStatus
                                        ] ||
                                        statusConfig.pending;

                                    return (
                                        <article
                                            key={req._id}
                                            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                        >

                                            {/* Card top */}
                                            <div className="border-b border-slate-100 p-5 dark:border-slate-800">

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/20">
                                                            <FaTint />
                                                        </div>

                                                        <div className="min-w-0">

                                                            <h3 className="truncate font-bold text-slate-800 dark:text-white">
                                                                {req.recipientName}
                                                            </h3>

                                                            <p className="mt-1 text-[11px] text-slate-400">
                                                                Request #
                                                                {(currentPage - 1) * itemsPerPage +
                                                                    index +
                                                                    1}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <span
                                                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${status.bg} ${status.text} ${status.border}`}
                                                    >
                                                        <FaCircle className={`text-[5px] ${status.dot}`} />
                                                        {status.label}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* Details */}
                                            <div className="grid grid-cols-2 gap-3 p-5">

                                                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                                                    <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        Blood Group
                                                    </p>

                                                    <div className="flex items-center gap-2">
                                                        <FaTint className="text-xs text-red-500" />
                                                        <span className="font-black text-red-600 dark:text-red-400">
                                                            {req.bloodGroup}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                                                    <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        Location
                                                    </p>

                                                    <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                        {req.recipientDistrict}
                                                    </p>

                                                    <p className="truncate text-[10px] text-slate-400">
                                                        {req.recipientUpazila}
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                                                    <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        Date
                                                    </p>

                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-[10px] text-red-400" />
                                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                            {req.donationDate}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                                                    <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        Time
                                                    </p>

                                                    <div className="flex items-center gap-2">
                                                        <FaClock className="text-[10px] text-red-400" />
                                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                            {req.donationTime}
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>


                                            {/* Donor */}
                                            {req.donationStatus === "inprogress" && (
                                                <div className="mx-5 mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-500 dark:bg-blue-900/30">
                                                            <FaUsers />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">
                                                                Assigned Donor
                                                            </p>

                                                            <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                                                                {req?.donorName}
                                                            </p>

                                                            <p className="truncate text-[10px] text-slate-400">
                                                                {req?.donorEmail}
                                                            </p>
                                                        </div>

                                                    </div>

                                                </div>
                                            )}


                                            {/* Actions */}
                                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/donation-details/${req._id}`
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-blue-500 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                >
                                                    <FaEye />
                                                    View
                                                </button>

                                                <div className="flex items-center gap-1">

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/edit-donation/${req._id}`
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-xl text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="text-xs" />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(req._id)
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        title="Delete"
                                                    >
                                                        <FaTrash className="text-xs" />
                                                    </button>

                                                    {req.donationStatus === "inprogress" && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusUpdate(
                                                                        req._id,
                                                                        "done"
                                                                    )
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-xl text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                                title="Complete"
                                                            >
                                                                <FaCheck className="text-xs" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleStatusUpdate(
                                                                        req._id,
                                                                        "cancelled"
                                                                    )
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-xl text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                                                title="Cancel"
                                                            >
                                                                <FaTimes className="text-xs" />
                                                            </button>
                                                        </>
                                                    )}

                                                </div>

                                            </div>

                                        </article>
                                    );
                                })}

                            </div>

                        </div>

                    ) : (

                        /* Filter empty state */
                        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800">
                                <FaTint className="text-3xl text-slate-300 dark:text-slate-600" />
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-800 dark:text-white">
                                No matching requests
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                                There are no donation requests under the
                                selected status.
                            </p>

                            <button
                                onClick={() => setSelectedStatus('all')}
                                className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                            >
                                Show All Requests
                            </button>

                        </div>

                    )

                ) : (

                    /* Complete empty state */
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

                        <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-red-500/5 blur-3xl" />

                        <div className="relative">

                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                <FaTint className="text-4xl" />
                            </div>

                            <h3 className="mt-6 text-xl font-black text-slate-800 dark:text-white">
                                No Donation Requests Yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                                When you need blood, create a request and let
                                the Dropvein community help you find a donor.
                            </p>

                            <Link
                                to="/dashboard/create-donation-request"
                                className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <FaPlusCircle />
                                Create Your First Request
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>

                        </div>

                    </div>

                )}

            </section>


            {/* =====================================================
                PAGINATION
            ====================================================== */}
            {totalPages > 1 && (

                <div className="flex items-center justify-center gap-2 pt-2">

                    <button
                        onClick={() =>
                            setCurrentPage(p => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                        <FaChevronLeft className="text-xs" />
                    </button>

                    <div className="flex items-center gap-1">

                        {Array.from(
                            { length: totalPages },
                            (_, i) => (
                                <button
                                    key={i}
                                    onClick={() =>
                                        setCurrentPage(i + 1)
                                    }
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all ${currentPage === i + 1
                                            ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/20'
                                            : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            )
                        )}

                    </div>

                    <button
                        onClick={() =>
                            setCurrentPage(p =>
                                Math.min(totalPages, p + 1)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                        <FaChevronRight className="text-xs" />
                    </button>

                </div>

            )}

        </div>
    );
};

export default MyDonationRequests;