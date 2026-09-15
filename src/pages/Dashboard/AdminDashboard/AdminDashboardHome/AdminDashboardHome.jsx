
import React, { useMemo } from 'react';
import {
    FaUsers,
    FaDonate,
    FaTint,
    FaChartLine,
    FaArrowUp,
    FaArrowRight,
    FaClock,
    FaCheckCircle,
    FaExclamationCircle,
    FaUserPlus,
    FaHandHoldingHeart,
    FaCalendarAlt,
    FaWallet,
    FaShieldAlt,
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import useUserRole from '../../../../hooks/userUserRole';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const AdminDashboardHome = () => {
    const { user } = useAuth();
    const { role } = useUserRole();
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading: loadingUsers } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    const { data: donationRequests = 0, isLoading: loadingDonations } =
        useQuery({
            queryKey: ['donation-requests'],
            queryFn: async () => {
                const res = await axiosSecure.get('/donation-requests');

                return res.data?.total || 0;
            },
        });

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
        }).format(number);
    };

    const statCards = [
        {
            title: 'Total Users',
            value: formatNumber(users.length),
            subtitle: 'Registered platform users',
            icon: FaUsers,
            iconBg: 'bg-blue-50 dark:bg-blue-500/10',
            iconColor: 'text-blue-600 dark:text-blue-400',
            accent: 'bg-blue-500',
        },
        {
            title: 'Blood Requests',
            value: formatNumber(donationRequests),
            subtitle: 'Total donation requests',
            icon: FaTint,
            iconBg: 'bg-red-50 dark:bg-red-500/10',
            iconColor: 'text-red-600 dark:text-red-400',
            accent: 'bg-red-500',
        },
    ];

    if (loadingUsers || loadingDonations) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Platform Overview
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Dashboard Overview
                    </h1>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Monitor your platform activity and performance.
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-300">
                        <FaCalendarAlt className="text-slate-400" />
                        <span>
                            {new Date().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <img
                            src={
                                user?.photoURL ||
                                'https://i.ibb.co/5GzXkwq/user.png'
                            }
                            alt="Admin"
                            className="w-9 h-9 rounded-lg object-cover"
                        />

                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {user?.displayName || 'Administrator'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                {role || 'Admin'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 p-6 sm:p-8 mb-8 shadow-lg shadow-red-500/10">

                <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full border-[40px] border-white/5"></div>
                <div className="absolute -right-8 -bottom-32 w-64 h-64 rounded-full border-[30px] border-white/5"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                    <div className="max-w-xl">

                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs font-medium text-red-100 mb-4">
                            <FaShieldAlt />
                            {role === 'admin' ? 'Admin Control Center' : 'Volunteer Workspace'}
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Welcome back, {user?.displayName?.split(' ')[0] || 'Admin'}!
                        </h2>

                        <p className="text-sm sm:text-base text-red-100 mt-3 leading-relaxed">
                            Keep track of your blood donation community,
                            manage requests, and make a meaningful impact.
                        </p>
                    </div>

                    <div className="hidden md:flex items-center justify-center w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-white/10 border border-white/10">
                        <FaHandHoldingHeart className="text-5xl text-white/90" />
                    </div>

                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">

                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20"
                        >

                            <div className="flex items-start justify-between gap-3">

                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                                    <Icon className={`text-xl ${card.iconColor}`} />
                                </div>

                                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-full px-2.5 py-1">
                                    <FaArrowUp className="text-[10px]" />
                                    Live
                                </div>

                            </div>

                            <div className="mt-5">

                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {card.title}
                                </p>

                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight break-words">
                                    {card.value}
                                </h3>

                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                    {card.subtitle}
                                </p>

                            </div>

                            <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.accent}`}></div>

                        </div>
                    );
                })}

            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Platform Performance */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">

                    <div className="flex items-center justify-between mb-7">

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Platform Performance
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Current platform statistics
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <FaChartLine className="text-slate-500 dark:text-slate-300" />
                        </div>

                    </div>

                    <div className="space-y-6">

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Registered Users
                                </span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {formatNumber(users.length)}
                                </span>
                            </div>

                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-blue-500 rounded-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Blood Requests
                                </span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {formatNumber(donationRequests)}
                                </span>
                            </div>

                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-red-500 rounded-full"></div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                <FaCheckCircle className="text-emerald-500" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Platform statistics are up to date
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Data is retrieved from your backend API.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">

                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Quick Actions
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage your platform
                        </p>
                    </div>

                    <div className="space-y-3">

                        <button
                            type="button"
                            onClick={() => window.location.href = '/dashboard/users'}
                            className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                <FaUserPlus className="text-blue-500" />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Manage Users
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    View registered users
                                </p>
                            </div>

                            <FaArrowRight className="text-slate-400 text-xs group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            type="button"
                            onClick={() => window.location.href = '/dashboard/donation-requests'}
                            className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                                <FaTint className="text-red-500" />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Blood Requests
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Monitor donation requests
                                </p>
                            </div>

                            <FaArrowRight className="text-slate-400 text-xs group-hover:translate-x-1 transition-transform" />
                        </button>

                    </div>

                </div>

            </div>

            {/* Bottom Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">

                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                            <FaTint className="text-red-500 text-xl" />
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Blood Donation Network
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Community management
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Manage donors, monitor blood requests, and support
                        patients in need through the BloodChattogram platform.
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <FaCheckCircle />
                        Community operations active
                    </div>

                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">

                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                            <FaClock className="text-blue-500 text-xl" />
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                System Status
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Backend connectivity
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                All services connected
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                API data loaded successfully
                            </p>
                        </div>

                        <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Online
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminDashboardHome;