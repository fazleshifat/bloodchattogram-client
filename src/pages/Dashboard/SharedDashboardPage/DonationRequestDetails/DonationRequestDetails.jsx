import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxios from '../../../../hooks/useAxios';
import useAuth from '../../../../hooks/useAuth';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import {
    FaTint, FaUser, FaEnvelope, FaMapMarkerAlt, FaHospital,
    FaCalendarAlt, FaClock, FaCommentMedical, FaCheckCircle,
    FaHandHoldingHeart, FaUserCheck, FaTimesCircle
} from 'react-icons/fa';

const DonationRequestDetails = () => {
    const { id } = useParams();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Donation Request Details";
    }, []);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['donation-request-details', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/donation-requests/${id}`);
            return res.data;
        }
    });

    const onConfirmDonation = async () => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to confirm your blood donation. Proceed?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, donate!',
            cancelButtonText: 'Cancel'
        });

        if (!confirm.isConfirmed) return;

        setSubmitting(true);
        try {
            await axiosSecure.patch(`/donation-requests/status/${id}/inprogress`, {
                donorName: user?.displayName || 'Anonymous',
                donorEmail: user?.email || 'No Email'
            });
            await refetch();
            Swal.fire({ icon: 'success', title: 'Donation Confirmed' });
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Failed to confirm donation' });
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <Spinner />;
    if (isError || !data) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-red-500 text-lg font-medium">Failed to load donation request.</p>
        </div>
    );

    const {
        requesterName, requesterEmail, recipientName,
        recipientDistrict, recipientUpazila, hospitalName,
        fullAddressLine, bloodGroup, donationDate, donationTime,
        requestMessage, donationStatus, createdAt, updatedAt,
        donorName, donorEmail, donationConfirmedAt
    } = data;

    const statusConfig = {
        pending: { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', label: 'Pending' },
        inprogress: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', label: 'In Progress' },
        done: { color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', label: 'Completed' },
        canceled: { color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', label: 'Cancelled' },
    };

    const status = statusConfig[donationStatus] || statusConfig.pending;

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="text-center mb-2">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
                        Request Details
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Donation <span className="gradient-text">Request</span>
                    </h2>
                    <div className="section-divider"></div>
                </div>

                {/* Blood Group & Status Hero Card */}
                <div className="relative bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <span className="text-3xl font-black">{bloodGroup}</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{recipientName}</h3>
                                <p className="text-red-200 text-sm flex items-center gap-1 mt-1">
                                    <FaMapMarkerAlt className="text-xs" /> {recipientDistrict}, {recipientUpazila}
                                </p>
                                <p className="text-red-200 text-sm flex items-center gap-1 mt-0.5">
                                    <FaHospital className="text-xs" /> {hospitalName}
                                </p>
                            </div>
                        </div>
                        <div className="text-center sm:text-right">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${status.color}`}>
                                {status.label}
                            </span>
                            <div className="mt-3 flex items-center gap-4 text-red-100 text-sm">
                                <span className="flex items-center gap-1"><FaCalendarAlt className="text-xs" /> {donationDate}</span>
                                <span className="flex items-center gap-1"><FaClock className="text-xs" /> {donationTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Requester Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Requester Info</h4>
                        <div className="space-y-4">
                            <DetailRow icon={<FaUser className="text-blue-500" />} label="Name" value={requesterName} />
                            <DetailRow icon={<FaEnvelope className="text-blue-500" />} label="Email" value={requesterEmail} />
                        </div>
                    </div>

                    {/* Recipient Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Recipient Info</h4>
                        <div className="space-y-4">
                            <DetailRow icon={<FaUser className="text-red-500" />} label="Name" value={recipientName} />
                            <DetailRow icon={<FaTint className="text-red-500" />} label="Blood Group" value={bloodGroup} />
                            <DetailRow icon={<FaMapMarkerAlt className="text-red-500" />} label="Location" value={`${recipientDistrict}, ${recipientUpazila}`} />
                        </div>
                    </div>

                    {/* Hospital Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Hospital Details</h4>
                        <div className="space-y-4">
                            <DetailRow icon={<FaHospital className="text-emerald-500" />} label="Hospital" value={hospitalName} />
                            <DetailRow icon={<FaMapMarkerAlt className="text-emerald-500" />} label="Full Address" value={fullAddressLine} />
                            <DetailRow icon={<FaCalendarAlt className="text-emerald-500" />} label="Date" value={donationDate} />
                            <DetailRow icon={<FaClock className="text-emerald-500" />} label="Time" value={donationTime} />
                        </div>
                    </div>

                    {/* Status & Timeline */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Status & Timeline</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <FaCheckCircle className="text-sm text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Status</p>
                                    <span className={`inline-block mt-0.5 px-3 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                                </div>
                            </div>
                            <DetailRow icon={<FaCalendarAlt className="text-gray-500" />} label="Created" value={format(new Date(createdAt), 'PPpp')} />
                            <DetailRow icon={<FaCalendarAlt className="text-gray-500" />} label="Updated" value={updatedAt ? format(new Date(updatedAt), 'PPpp') : 'Never updated'} />
                            <DetailRow icon={<FaCalendarAlt className="text-gray-500" />} label="Confirmed" value={donationConfirmedAt ? format(new Date(donationConfirmedAt), 'PPpp') : 'Not yet'} />
                        </div>
                    </div>
                </div>

                {/* Message */}
                {requestMessage && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
                            <FaCommentMedical className="text-red-400" /> Request Message
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-sm italic">
                            "{requestMessage}"
                        </p>
                    </div>
                )}

                {/* Donor Info (if donated) */}
                {donorName && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/40 rounded-2xl p-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                            <FaUserCheck /> Donor Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailRow icon={<FaUser className="text-green-500" />} label="Donor Name" value={donorName} />
                            <DetailRow icon={<FaEnvelope className="text-green-500" />} label="Donor Email" value={donorEmail || 'N/A'} />
                        </div>
                    </div>
                )}

                {/* Donate CTA */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center">
                    {!donorName ? (
                        donationStatus === 'pending' ? (
                            <div>
                                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                                    <FaHandHoldingHeart className="text-2xl text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Save a Life?</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                                    This patient needs <strong className="text-red-600 dark:text-red-400">{bloodGroup}</strong> blood at <strong>{hospitalName}</strong>.
                                    Click the button below to confirm your donation.
                                </p>
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 transition-all duration-300 pulse-glow cursor-pointer"
                                >
                                    <FaTint className="text-sm" /> Donate Blood Now
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                                    <FaTimesCircle className="text-2xl text-gray-400" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    This request is no longer accepting donations.
                                </p>
                            </div>
                        )
                    ) : (
                        <div>
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                <FaCheckCircle className="text-2xl text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Donation Confirmed</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong className="text-green-600 dark:text-green-400">{donorName}</strong> has confirmed to donate blood for this request.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Donation Confirmation Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md w-full overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white text-center">
                            <div className="w-14 h-14 mx-auto mb-3 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <FaHandHoldingHeart className="text-2xl" />
                            </div>
                            <h2 className="text-xl font-bold">Confirm Your Donation</h2>
                            <p className="text-sm text-red-200 mt-1">You're about to save a life</p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit(onConfirmDonation)} className="p-6 space-y-5">
                            {/* Donation Summary */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg font-black text-red-600 dark:text-red-400">{bloodGroup}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Donating to {recipientName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{hospitalName}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    defaultValue={user?.displayName}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Email</label>
                                <input
                                    type="email"
                                    readOnly
                                    defaultValue={user?.email}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 ${submitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/20'
                                        }`}
                                >
                                    {submitting ? 'Processing...' : 'Confirm Donation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {React.cloneElement(icon, { className: `text-sm ${icon.props.className}` })}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">{value}</p>
        </div>
    </div>
);

export default DonationRequestDetails;
