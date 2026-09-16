import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import {
    FaTint,
    FaMapMarkerAlt,
    FaSearch,
    FaPhoneAlt,
    FaCalendarAlt,
    FaChevronDown,
    FaUsers,
    FaHeartbeat
} from 'react-icons/fa';

const SearchDonors = () => {
    const { setLoading } = useAuth();
    const axiosSecure = useAxios();

    const [donors, setDonors] = useState([]);
    const [filteredDonors, setFilteredDonors] = useState([]);
    const [searched, setSearched] = useState(false);

    const { districts, upazilas } = useLoaderData();

    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedUpazila, setSelectedUpazila] = useState('');
    const [selectedBlood, setSelectedBlood] = useState('');
    const [districtName, setDistrictName] = useState('');

    const filteredUpazilas = upazilas.filter(
        u => u.district_id == selectedDistrict
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Donors';

        axiosSecure
            .get('/active-donors')
            .then(res => {
                setDonors(res.data);
                setFilteredDonors(res.data);
            })
            .finally(() => setLoading(false));
    }, [axiosSecure]);

    useEffect(() => {
        if (selectedDistrict) {
            const districtObj = districts.find(
                d => d.id == selectedDistrict
            );

            setDistrictName(districtObj?.name || '');
        }
    }, [selectedDistrict, districts]);

    useEffect(() => {
        const allEmpty =
            !selectedBlood &&
            !selectedDistrict &&
            !selectedUpazila;

        if (allEmpty && searched) {
            setFilteredDonors([]);
            setSearched(false);
        }
    }, [
        selectedBlood,
        selectedDistrict,
        selectedUpazila,
        searched
    ]);

    const handleSearch = () => {
        setSearched(true);

        const result = donors.filter(donor => {
            const matchesBlood = selectedBlood
                ? donor.blood_group === selectedBlood
                : true;

            const matchesDistrict = selectedDistrict
                ? donor.district === districtName
                : true;

            const matchesUpazila = selectedUpazila
                ? donor.upazila === selectedUpazila
                : true;

            return (
                matchesBlood &&
                matchesDistrict &&
                matchesUpazila
            );
        });

        setFilteredDonors(result);
    };

    const handleSeeAll = () => {
        setSearched(true);
        setFilteredDonors(donors);
    };

    const isSearchDisabled =
        !selectedBlood &&
        !selectedDistrict &&
        !selectedUpazila;

    const selectClass =
        'w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20 transition-all text-gray-800 dark:text-gray-200 text-sm appearance-none cursor-pointer';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 md:py-10 px-4 md:px-6">

            <div className="max-w-7xl mx-auto">

                {/* ========================================
                    PAGE HEADER
                ======================================== */}
                <div className="mb-7">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                            <FaUsers className="text-red-500 text-lg" />
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                Find Blood Donors
                            </h1>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                Find an active donor near you
                            </p>
                        </div>
                    </div>
                </div>


                {/* ========================================
                    MAIN CONTENT
                ======================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:items-start">


                    {/* ========================================
                        LEFT - SEARCH PANEL
                    ======================================== */}
                    <aside className="lg:sticky lg:top-6">

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

                            {/* Search Header */}
                            <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                        <FaSearch className="text-red-500" />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-gray-900 dark:text-white">
                                            Search Donors
                                        </h2>

                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Filter by your needs
                                        </p>
                                    </div>

                                </div>
                            </div>


                            {/* Filters */}
                            <div className="p-5 space-y-5">

                                {/* Blood Group */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                                        Blood Group
                                    </label>

                                    <div className="relative">

                                        <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 text-sm pointer-events-none" />

                                        <select
                                            onChange={(e) =>
                                                setSelectedBlood(e.target.value)
                                            }
                                            className={`${selectClass} pl-10 pr-10`}
                                            defaultValue=""
                                        >
                                            <option value="">
                                                All blood groups
                                            </option>

                                            {[
                                                'A+',
                                                'A-',
                                                'B+',
                                                'B-',
                                                'AB+',
                                                'AB-',
                                                'O+',
                                                'O-'
                                            ].map(group => (
                                                <option
                                                    key={group}
                                                    value={group}
                                                >
                                                    {group}
                                                </option>
                                            ))}
                                        </select>

                                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />

                                    </div>
                                </div>


                                {/* District */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                                        District
                                    </label>

                                    <div className="relative">

                                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 text-sm pointer-events-none" />

                                        <select
                                            onChange={(e) =>
                                                setSelectedDistrict(e.target.value)
                                            }
                                            className={`${selectClass} pl-10 pr-10`}
                                            defaultValue=""
                                        >
                                            <option value="">
                                                All districts
                                            </option>

                                            {districts.map(d => (
                                                <option
                                                    key={d.id}
                                                    value={d.id}
                                                >
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>

                                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />

                                    </div>
                                </div>


                                {/* Upazila */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                                        Upazila
                                    </label>

                                    <div className="relative">

                                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 text-sm pointer-events-none" />

                                        <select
                                            onChange={(e) =>
                                                setSelectedUpazila(e.target.value)
                                            }
                                            className={`${selectClass} pl-10 pr-10`}
                                            disabled={!selectedDistrict}
                                            defaultValue=""
                                        >
                                            <option value="">
                                                All upazilas
                                            </option>

                                            {filteredUpazilas.map(u => (
                                                <option
                                                    key={u.id}
                                                    value={u.name}
                                                >
                                                    {u.name}
                                                </option>
                                            ))}
                                        </select>

                                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />

                                    </div>

                                    {!selectedDistrict && (
                                        <p className="text-[11px] text-gray-400 mt-2">
                                            Select a district first
                                        </p>
                                    )}
                                </div>


                                {/* Search Button */}
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearchDisabled}
                                    className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${isSearchDisabled
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 cursor-pointer'
                                        }`}
                                >
                                    <FaSearch className="text-xs" />
                                    Search Donors
                                </button>


                                {/* See All */}
                                {searched && (
                                    <button
                                        onClick={handleSeeAll}
                                        className="w-full px-5 py-3 rounded-xl font-semibold text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                                    >
                                        See All Donors
                                    </button>
                                )}

                            </div>

                        </div>


                        {/* Small Info Card */}
                        <div className="hidden lg:flex mt-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 gap-3">

                            <div className="shrink-0 w-9 h-9 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                                <FaHeartbeat className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                    Every donation matters
                                </p>

                                <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 mt-1">
                                    Connect with active blood donors and help someone in need.
                                </p>
                            </div>

                        </div>

                    </aside>


                    {/* ========================================
                        RIGHT - DONOR RESULTS
                    ======================================== */}
                    <section>

                        {/* Results Header */}
                        {searched && filteredDonors.length > 0 && (
                            <div className="flex items-center justify-between mb-4">

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Available Donors
                                    </h2>

                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {filteredDonors.length}{' '}
                                        {filteredDonors.length === 1
                                            ? 'donor'
                                            : 'donors'}{' '}
                                        found
                                    </p>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Active donors
                                </div>

                            </div>
                        )}


                        {/* Initial State */}
                        {!searched ? (

                            <div className="min-h-[430px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center">

                                <div className="text-center max-w-sm px-6">

                                    <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
                                        <FaSearch className="text-3xl text-red-400" />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        Find the right donor
                                    </h3>

                                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                        Choose a blood group, district, or upazila from the filters to find available donors.
                                    </p>

                                </div>

                            </div>

                        ) : filteredDonors.length === 0 ? (

                            /* No Results */
                            <div className="min-h-[430px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center">

                                <div className="text-center px-6">

                                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-5">
                                        <FaTint className="text-3xl text-gray-300 dark:text-gray-600" />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        No donors found
                                    </h3>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                        We couldn't find an active donor matching your selected criteria.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            /* Donor Cards */
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                {filteredDonors.map(donor => (

                                    <div
                                        key={donor._id}
                                        className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-red-200 dark:hover:border-red-900/50 hover:shadow-xl hover:shadow-gray-200/40 dark:hover:shadow-black/20 transition-all duration-300"
                                    >

                                        {/* Card Top */}
                                        <div className="p-5">

                                            <div className="flex items-start gap-4">

                                                {/* Avatar */}
                                                <div className="relative shrink-0">

                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 ring-4 ring-gray-50 dark:ring-gray-800/80">
                                                        <img
                                                            src={
                                                                donor.photoURL ||
                                                                'https://i.ibb.co/5GzXkwq/user.png'
                                                            }
                                                            alt={donor.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>

                                                    {/* Online Status */}
                                                    <span className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                                        <span className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
                                                    </span>

                                                </div>


                                                {/* Name + Blood */}
                                                <div className="min-w-0 flex-1">

                                                    <div className="flex items-start justify-between gap-2">

                                                        <div className="min-w-0">
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                                                {donor.name}
                                                            </h3>

                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <FaMapMarkerAlt className="text-red-400 text-[10px]" />

                                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                    {donor.upazila || 'N/A'}, {donor.district || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>


                                                        {/* Blood Group */}
                                                        <div className="shrink-0 flex flex-col items-center">

                                                            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center">
                                                                <span className="text-red-600 dark:text-red-400 font-extrabold text-sm">
                                                                    {donor.blood_group || 'N/A'}
                                                                </span>
                                                            </div>

                                                            <span className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">
                                                                Blood
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* Divider */}
                                            <div className="border-t border-gray-100 dark:border-gray-800 my-5"></div>


                                            {/* Information */}
                                            <div className="grid grid-cols-2 gap-3">

                                                {/* Phone */}
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">

                                                    <div className="w-9 h-9 shrink-0 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                                                        <FaPhoneAlt className="text-green-500 text-xs" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400">
                                                            Phone
                                                        </p>

                                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate mt-0.5">
                                                            {donor.phone || 'N/A'}
                                                        </p>
                                                    </div>

                                                </div>


                                                {/* Last Donation */}
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">

                                                    <div className="w-9 h-9 shrink-0 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                                                        <FaCalendarAlt className="text-red-400 text-xs" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400">
                                                            Last Donation
                                                        </p>

                                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate mt-0.5">
                                                            {donor.lastDonate || 'N/A'}
                                                        </p>
                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                        {/* Card Footer */}
                                        <div className="px-5 py-3.5 bg-gray-50/80 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">

                                            <div className="flex items-center gap-2">

                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>

                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    Available donor
                                                </span>

                                            </div>

                                            <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                                BloodChattogram
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </div>

            </div>
        </div>
    );
};

export default SearchDonors;