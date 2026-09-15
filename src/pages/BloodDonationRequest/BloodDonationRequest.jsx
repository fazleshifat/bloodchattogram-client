import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/Spinner';
import { FaTint, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const BloodDonationRequests = () => {
    const axios = useAxios();
    const { user } = useAuth();

    const { data: donationRequests = [], isLoading } = useQuery({
        queryKey: ['bloodDonationRequest'],
        queryFn: async () => {
            const res = await axios.get('/donation-requests/public?status=pending');
            return res.data;
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Blood Donation Request";
    }, []);

    if (isLoading) return <Spinner />;

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
                        Help Someone Today
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Pending <span className="gradient-text">Donation Requests</span>
                    </h2>
                    <div className="section-divider mb-5"></div>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        These people urgently need blood. Browse the requests below and click <strong className="text-red-600 dark:text-red-400">"View"</strong> to see full details and donate blood to them. Your single donation can save a life.
                    </p>
                </div>

                {/* Info Banner */}
                <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border border-red-200 dark:border-red-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                        <FaTint className="text-xl text-red-500" />
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">How it works</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click on any request to view full details including hospital name, address, and required blood group. You can then confirm your willingness to donate and help save a life.
                        </p>
                    </div>
                </div>

                {donationRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <FaTint className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No pending donation requests found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {donationRequests.map((req) => (
                            <div key={req._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden card-hover">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{req.recipientName}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                <FaMapMarkerAlt className="text-red-400 text-xs" />
                                                {req.recipientDistrict}, {req.recipientUpazila}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-lg font-bold">
                                            <FaTint className="text-sm" />
                                            {req.bloodGroup}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-5">
                                        <p className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400 text-xs" />
                                            {req.donationDate}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaClock className="text-gray-400 text-xs" />
                                            {req.donationTime}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold capitalize">
                                            {req.donationStatus}
                                        </span>
                                        <Link
                                            to={`/donation-details/${req._id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl transition-all shadow-md shadow-red-500/20"
                                        >
                                            <FaTint className="text-xs" /> View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodDonationRequests;
