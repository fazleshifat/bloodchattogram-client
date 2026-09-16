import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Spinner from '../../../../components/Spinner';
import useAuth from '../../../../hooks/useAuth';

import {
    FaTint,
    FaUser,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHospital,
    FaCalendarAlt,
    FaClock,
    FaCommentMedical,
    FaCheckCircle,
    FaHandHoldingHeart,
    FaUserCheck,
    FaTimesCircle,
    FaPhone
} from 'react-icons/fa';

const DonationRequestDetails = () => {
    const { id } = useParams();

    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['donation-request-details', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/donation-requests/${id}`);
            return res.data;
        }
    });

    const {
        data: donorProfile = [],
        isLoading: donorProfileLoading
    } = useQuery({
        queryKey: ['donor-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/profile?email=${user.email}`);
            return res.data;
        }
    });

    const donor = donorProfile?.[0];

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Donation Request Details';
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="text-center">
                    <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />

                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Request Not Found
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400">
                        We could not find this donation request.
                    </p>
                </div>
            </div>
        );
    }

    const {
        requesterName,
        requesterEmail,
        requesterPhone,
        recipientName,
        recipientDistrict,
        recipientUpazila,
        hospitalName,
        fullAddressLine,
        bloodGroup,
        donationDate,
        donationTime,
        requestMessage,
        donationStatus,
        createdAt,
        updatedAt,
        donorName,
        donorPhone,
        donorEmail,
        donorDistrict,
        donationConfirmedAt
    } = data;

    const statusConfig = {
        pending: {
            label: 'Pending',
            color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
            icon: <FaClock />
        },

        inprogress: {
            label: 'Donation In Progress',
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            icon: <FaHandHoldingHeart />
        },

        done: {
            label: 'Completed',
            color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            icon: <FaCheckCircle />
        },

        canceled: {
            label: 'Canceled',
            color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            icon: <FaTimesCircle />
        }
    };

    const status = statusConfig[donationStatus] || statusConfig.pending;

    const donationDateTime = new Date(
        `${donationDate} ${donationTime}`
    );

    const isDonationTimePassed =
        !isNaN(donationDateTime.getTime()) &&
        new Date() > donationDateTime;

    const canDonate =
        donationStatus === 'pending' &&
        !donorName &&
        !isDonationTimePassed;

    const onConfirmDonation = async () => {
        const result = await Swal.fire({
            title: 'Confirm Donation?',
            text: 'Are you sure you want to donate blood for this request?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, I will Donate',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        setSubmitting(true);

        try {
            await axiosSecure.patch(
                `/donation-requests/status/${id}/inprogress`,
                {
                    donorName: donor?.name || 'Anonymous',
                    donorPhone: donor?.phone || 'Not provided',
                    donorEmail: donor?.email || 'No Email',
                    donorDistrict: donor?.district || 'Not provided'
                }
            );

            await refetch();

            setIsOpen(false);

            Swal.fire({
                icon: 'success',
                title: 'Thank You!',
                text: 'You have successfully joined this blood donation request.',
                confirmButtonColor: '#dc2626'
            });
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text:
                    error?.response?.data?.message ||
                    'Unable to confirm your donation. Please try again.',
                confirmButtonColor: '#dc2626'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>Blood Donation</span>
                        <span>/</span>
                        <span>Request Details</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        Donation Request Details
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        View complete information about this blood donation request.
                    </p>

                </div>


                {/* Hero */}
                <div className="relative bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-3 lg:p-7 text-white overflow-hidden mb-8">

                    <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10"></div>

                    <div className="absolute -left-20 -bottom-20 w-56 h-56 rounded-full bg-white/10"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 lg:gap-6">

                        {/* Recipient */}
                        <div className="flex items-center gap-5">

                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <FaTint className="text-4xl text-white" />
                            </div>

                            <div>

                                <p className="text-red-100 text-sm mb-1">
                                    Blood Needed
                                </p>

                                <div className="flex items-center gap-3">

                                    <h2 className="text-4xl font-bold">
                                        {bloodGroup}
                                    </h2>

                                    <span className="text-xl text-red-100">
                                        for {recipientName}
                                    </span>

                                </div>

                                <p className="text-red-100 text-sm mt-2 flex items-center gap-1">
                                    <FaMapMarkerAlt />
                                    {recipientDistrict}, {recipientUpazila}
                                </p>

                            </div>
                        </div>


                        {/* Status + Time */}
                        <div className="text-center sm:text-right">

                            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">

                                {/* Current Request Status */}
                                {
                                    !isDonationTimePassed &&
                                    <span
                                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${status.color}`}
                                    >
                                        {status.icon}
                                        {status.label}
                                    </span>
                                }

                                {/* Donation Time Passed */}
                                {isDonationTimePassed && (
                                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                        <FaTimesCircle />
                                        Donation Time Passed
                                    </span>
                                )}

                            </div>


                            {/* Date + Time */}
                            <div className="mt-3 flex items-center justify-center sm:justify-end gap-4 text-red-100 text-sm">

                                <span className="flex items-center gap-1">
                                    <FaCalendarAlt className="text-xs" />
                                    {donationDate}
                                </span>

                                <span className="flex items-center gap-1">
                                    <FaClock className="text-xs" />
                                    {donationTime}
                                </span>

                            </div>


                            {/* Small Donate Button */}
                            {canDonate && (
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(true)}
                                    className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-red-600 hover:bg-red-50 text-sm font-semibold shadow-md transition-all duration-300"
                                >
                                    <FaHandHoldingHeart />
                                    Donate Now
                                </button>
                            )}

                        </div>
                    </div>
                </div>


                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-1">

                    {/* Recipient */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 h-fit">

                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                            Recipient Information
                        </h4>

                        <div className="space-y-4">

                            <DetailRow
                                icon={<FaUser className="text-red-500" />}
                                label="Patient Name"
                                value={recipientName}
                            />

                            <DetailRow
                                icon={<FaTint className="text-red-500" />}
                                label="Blood Group"
                                value={bloodGroup}
                            />

                            <DetailRow
                                icon={<FaMapMarkerAlt className="text-red-500" />}
                                label="Location"
                                value={`${recipientDistrict}, ${recipientUpazila}`}
                            />

                        </div>
                    </div>


                    {/* Hospital */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 h-fit">

                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                            Hospital Details
                        </h4>

                        <div className="space-y-4">

                            <DetailRow
                                icon={<FaHospital className="text-purple-500" />}
                                label="Hospital"
                                value={hospitalName}
                            />

                            <DetailRow
                                icon={<FaMapMarkerAlt className="text-purple-500" />}
                                label="Address"
                                value={fullAddressLine}
                            />

                            <DetailRow
                                icon={<FaCalendarAlt className="text-purple-500" />}
                                label="Donation Date"
                                value={donationDate}
                            />

                            <DetailRow
                                icon={<FaClock className="text-purple-500" />}
                                label="Donation Time"
                                value={donationTime}
                            />

                        </div>
                    </div>


                    {/* Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 h-fit">

                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                            Status & Timeline
                        </h4>

                        <div className="space-y-4">

                            <DetailRow
                                icon={status.icon}
                                label="Current Status"
                                value={status.label}
                            />

                            {isDonationTimePassed && (
                                <DetailRow
                                    icon={<FaTimesCircle className="text-red-500" />}
                                    label="Donation Time"
                                    value="Donation time has passed"
                                />
                            )}

                            {createdAt && (
                                <DetailRow
                                    icon={<FaCalendarAlt className="text-gray-500" />}
                                    label="Request Created"
                                    value={format(
                                        new Date(createdAt),
                                        'dd MMM yyyy, hh:mm a'
                                    )}
                                />
                            )}

                            {updatedAt && (
                                <DetailRow
                                    icon={<FaClock className="text-gray-500" />}
                                    label="Last Updated"
                                    value={format(
                                        new Date(updatedAt),
                                        'dd MMM yyyy, hh:mm a'
                                    )}
                                />
                            )}

                        </div>
                    </div>


                    {/* Requester */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 h-fit">

                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                            Requester Info
                        </h4>

                        <div className="space-y-2">

                            <DetailRow
                                icon={<FaUser className="text-blue-500" />}
                                label="Name"
                                value={requesterName}
                            />

                            <DetailRow
                                icon={<FaPhone className="text-blue-500" />}
                                label="Phone"
                                value={requesterPhone || 'Not provided'}
                            />

                            <DetailRow
                                icon={<FaEnvelope className="text-blue-500" />}
                                label="Email"
                                value={requesterEmail}
                            />

                            <DetailRow
                                icon={<FaCommentMedical className="text-red-500" />}
                                label="Requester Message"
                                value={requestMessage}
                            />

                        </div>
                    </div>


                    {/* Donor Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-800 p-3 h-fit">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                            Donor Information
                        </h4>

                        {donorName ? (

                            <>
                                <div className="space-y-2">

                                    <DetailRow
                                        icon={<FaUserCheck className="text-green-500" />}
                                        label="Donor Name"
                                        value={donorName}
                                    />

                                    <DetailRow
                                        icon={<FaPhone className="text-green-500" />}
                                        label="Phone"
                                        value={donorPhone || 'Not provided'}
                                    />

                                    <DetailRow
                                        icon={<FaEnvelope className="text-green-500" />}
                                        label="Email"
                                        value={donorEmail || 'Not provided'}
                                    />

                                    <DetailRow
                                        icon={<FaMapMarkerAlt className="text-green-500" />}
                                        label="District"
                                        value={donorDistrict || 'Not provided'}
                                    />

                                </div>

                                {donationConfirmedAt && (
                                    <p className="text-xs text-gray-400 mt-4">
                                        Donation confirmed on{' '}
                                        {format(
                                            new Date(donationConfirmedAt),
                                            'dd MMM yyyy, hh:mm a'
                                        )}
                                    </p>
                                )}
                            </>

                        ) : (

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Donor not found!
                            </p>

                        )}

                    </div>

                </div>


                {/* Bottom CTA */}
                {canDonate && (
                    <div className="mt-8 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border border-red-200 dark:border-red-800/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5">

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <FaHandHoldingHeart className="text-red-500 text-xl" />
                            </div>

                            <div>

                                <h3 className="font-bold text-gray-800 dark:text-white">
                                    Can you help?
                                </h3>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Your donation can help save a life.
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold shadow-lg shadow-red-500/20 transition-all"
                        >
                            <FaTint />
                            Donate Blood Now
                        </button>

                    </div>
                )}


                {/* Already Donated */}
                {donorName && (
                    <div className="mt-8 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/40 rounded-2xl p-6 text-center">

                        <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-3" />

                        <h3 className="font-bold text-green-700 dark:text-green-400">
                            A donor has already joined this request
                        </h3>

                        <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                            Thank you to the donor for helping save a life.
                        </p>

                    </div>
                )}

            </div>


            {/* Donation Modal */}
            {isOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => !submitting && setIsOpen(false)}
                    ></div>


                    {/* Modal */}
                    <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h3 className="text-xl font-bold">
                                        Confirm Blood Donation
                                    </h3>

                                    <p className="text-red-100 text-sm mt-1">
                                        Your information will be shared with the requester.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setIsOpen(false)}
                                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                >
                                    <FaTimesCircle />
                                </button>

                            </div>
                        </div>


                        {/* Modal Body */}
                        <div className="p-6">

                            {/* Donation Summary */}
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 mb-6">

                                <div className="flex items-center gap-4">

                                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <FaTint className="text-red-500 text-xl" />
                                    </div>

                                    <div>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            You are donating
                                        </p>

                                        <h4 className="font-bold text-gray-800 dark:text-white">
                                            {bloodGroup} Blood
                                        </h4>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            For {recipientName}
                                        </p>

                                    </div>

                                </div>
                            </div>


                            {/* Donor Information */}
                            <div className="mb-6">

                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                                    Donor Information
                                </h4>

                                {donorProfileLoading ? (

                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Loading your profile...
                                    </div>

                                ) : (

                                    <div className="grid grid-cols-2 gap-2">

                                        {/* Name */}
                                        <div>

                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Name
                                            </label>

                                            <div className="relative">

                                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={donor?.name || 'Not provided'}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 outline-none"
                                                />

                                            </div>
                                        </div>


                                        {/* Phone */}
                                        <div>

                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Phone Number
                                            </label>

                                            <div className="relative">

                                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={donor?.phone || 'Not provided'}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 outline-none"
                                                />

                                            </div>
                                        </div>


                                        {/* Email */}
                                        <div>

                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Email
                                            </label>

                                            <div className="relative">

                                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type="email"
                                                    readOnly
                                                    value={donor?.email || 'Not provided'}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 outline-none"
                                                />

                                            </div>
                                        </div>


                                        {/* District */}
                                        <div>

                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                District
                                            </label>

                                            <div className="relative">

                                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={donor?.district || 'Not provided'}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 outline-none"
                                                />

                                            </div>
                                        </div>

                                    </div>

                                )}

                            </div>


                            {/* Warning */}
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 mb-6">

                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    By confirming, you agree to donate blood for this request.
                                    Please make sure you can attend at the requested date,
                                    time, and hospital.
                                </p>

                            </div>


                            {/* Buttons */}
                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={submitting || donorProfileLoading}
                                    onClick={onConfirmDonation}
                                    className="flex-1 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Confirming...
                                        </>
                                    ) : (
                                        <>
                                            <FaHandHoldingHeart />
                                            Confirm Donation
                                        </>
                                    )}
                                </button>

                            </div>

                        </div>
                    </div>

                </div>
            )}

        </div>
    );
};


const DetailRow = ({ icon, label, value }) => {
    return (
        <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs text-gray-400 dark:text-gray-500">
                    {label}
                </p>

                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 break-words">
                    {value || 'Not provided'}
                </p>

            </div>

        </div>
    );
};

export default DonationRequestDetails;
