import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import { FaTint, FaMapMarkerAlt, FaEnvelope, FaSearch } from 'react-icons/fa';

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

    const filteredUpazilas = upazilas.filter(u => u.district_id == selectedDistrict);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Dropvein | Donors';
        axiosSecure.get('/active-donors')
            .then(res => {
                setDonors(res.data);
                setFilteredDonors(res.data);
            })
            .finally(() => setLoading(false));
    }, [axiosSecure]);

    useEffect(() => {
        if (selectedDistrict) {
            const districtObj = districts.find(d => d.id == selectedDistrict);
            setDistrictName(districtObj?.name || '');
        }
    }, [selectedDistrict, districts]);

    useEffect(() => {
        const allEmpty = !selectedBlood && !selectedDistrict && !selectedUpazila;
        if (allEmpty && searched) {
            setFilteredDonors([]);
            setSearched(false);
        }
    }, [selectedBlood, selectedDistrict, selectedUpazila, searched]);

    const handleSearch = () => {
        setSearched(true);
        const result = donors.filter(donor => {
            const matchesBlood = selectedBlood ? donor.blood_group === selectedBlood : true;
            const matchesDistrict = selectedDistrict ? donor.district === districtName : true;
            const matchesUpazila = selectedUpazila ? donor.upazila === selectedUpazila : true;
            return matchesBlood && matchesDistrict && matchesUpazila;
        });
        setFilteredDonors(result);
    };

    const handleSeeAll = () => {
        setSearched(true);
        setFilteredDonors(donors);
    };

    const isSearchDisabled = !selectedBlood && !selectedDistrict && !selectedUpazila;

    const selectClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200 text-sm";

    return (
        <div className="min-h-screen py-16 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
                        Find a Donor
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Search <span className="gradient-text">Blood Donors</span>
                    </h2>
                    <div className="section-divider"></div>
                </div>

                {/* Search Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 mb-8">
                    {/* Helper message */}
                    <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/15 border border-red-100 dark:border-red-800/30">
                        <FaTint className="text-red-500 text-lg mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Find a blood donor near you</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select at least one field below to search. You can filter by blood group, district, or upazila — use any combination you need.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <span className="inline-flex items-center gap-1.5"><FaTint className="text-red-400 text-xs" /> Blood Group</span>
                            </label>
                            <select onChange={(e) => setSelectedBlood(e.target.value)} className={selectClass} defaultValue="">
                                <option value="">All blood groups</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <span className="inline-flex items-center gap-1.5"><FaMapMarkerAlt className="text-red-400 text-xs" /> District</span>
                            </label>
                            <select onChange={(e) => setSelectedDistrict(e.target.value)} className={selectClass} defaultValue="">
                                <option value="">All districts</option>
                                {districts.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <span className="inline-flex items-center gap-1.5"><FaMapMarkerAlt className="text-red-400 text-xs" /> Upazila</span>
                            </label>
                            <select onChange={(e) => setSelectedUpazila(e.target.value)} className={selectClass} disabled={!selectedDistrict} defaultValue="">
                                <option value="">All upazilas</option>
                                {filteredUpazilas.map(u => (
                                    <option key={u.id} value={u.name}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <button
                            onClick={handleSearch}
                            className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${isSearchDisabled
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl cursor-pointer'
                                }`}
                        >
                            <FaSearch className="text-sm" /> Search Donors
                        </button>
                        {searched && (
                            <button
                                onClick={handleSeeAll}
                                className="hidden px-8 py-3 rounded-xl font-semibold border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                            >
                                See All Donors
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!searched ? (
                        <div className="col-span-full text-center py-16">
                            <FaSearch className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">Search donors based on your need.</p>
                        </div>
                    ) : filteredDonors.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <FaTint className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-red-500 text-lg font-medium">No donors found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredDonors.map(donor => (
                            <div key={donor._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center card-hover">
                                <div className="relative inline-block mb-4">
                                    <img
                                        src={donor.photoURL}
                                        alt={donor.name}
                                        className="w-20 h-20 object-cover rounded-full ring-3 ring-red-200 dark:ring-red-800 mx-auto"
                                    />
                                    <span className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                        {donor.blood_group}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{donor.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mb-1">
                                    <FaMapMarkerAlt className="text-red-400 text-xs" />
                                    {donor.upazila}, {donor.district}
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
                                    <FaEnvelope className="text-red-400 text-xs" />
                                    {donor.email}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchDonors;
