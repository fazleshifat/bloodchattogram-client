import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Spinner from '../../components/Spinner';
import {
    FaTint,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaArrowRight
} from 'react-icons/fa';

const BloodDonationRequests = () => {
    const axios = useAxios();

    const {
        data: donationRequests = [],
        isLoading
    } = useQuery({
        queryKey: ['bloodDonationRequest'],
        queryFn: async () => {
            const res = await axios.get('/donation-requests/public?status=pending');
            return res.data;
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Blood Donation Request';
    }, []);

    const upcomingRequests = donationRequests.filter((req) => {
        const donationDateTime = new Date(
            `${req.donationDate} ${req.donationTime}`
        );

        return (
            !isNaN(donationDateTime.getTime()) &&
            new Date() < donationDateTime
        );
    });

    if (isLoading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-7">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold mb-3">
                                <FaTint />
                                Blood Requests
                            </span>

                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Pending{' '}
                                <span className="gradient-text">
                                    Donation Requests
                                </span>
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                                Find pending blood donation requests and help
                                someone in need.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-sm">
                            <FaTint className="text-red-500" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {upcomingRequests.length} Pending
                            </span>
                        </div>

                    </div>
                </div>

                {/* Requests */}
                {upcomingRequests.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-16 px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                            <FaTint className="text-3xl text-red-400" />
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                            No Pending Requests
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            There are currently no pending blood donation requests.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {upcomingRequests.map((req) => {

                            const donationDateTime = new Date(
                                `${req.donationDate} ${req.donationTime}`
                            );

                            return (
                                <div
                                    key={req._id}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:border-red-200 dark:hover:border-red-800 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300"
                                >
                                    {/* Card Top */}
                                    <div className="p-5">

                                        <div className="flex items-start justify-between gap-3 mb-4">

                                            <div className="min-w-0">
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                                                    {req.recipientName}
                                                </h3>

                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1.5">
                                                    <FaMapMarkerAlt className="text-red-400" />
                                                    <span className="truncate">
                                                        {req.recipientDistrict},{' '}
                                                        {req.recipientUpazila}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Blood Group */}
                                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex flex-col items-center justify-center">
                                                <FaTint className="text-red-500 text-xs mb-0.5" />
                                                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                                    {req.bloodGroup}
                                                </span>
                                            </div>

                                        </div>

                                        {/* Date & Time */}
                                        <div className="grid grid-cols-2 gap-2 mb-4">

                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5">
                                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                    <FaCalendarAlt className="text-xs" />
                                                    <span className="text-[11px]">
                                                        Date
                                                    </span>
                                                </div>

                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    {req.donationDate}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5">
                                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                    <FaClock className="text-xs" />
                                                    <span className="text-[11px]">
                                                        Time
                                                    </span>
                                                </div>

                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    {req.donationTime}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Pending */}
                                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">

                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>

                                                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                                    pending
                                                </span>
                                            </div>

                                            <Link
                                                to={`/donation-details/${req._id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg transition-all shadow-sm shadow-red-500/20"
                                            >
                                                View Request
                                                <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                                            </Link>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
};

export default BloodDonationRequests;