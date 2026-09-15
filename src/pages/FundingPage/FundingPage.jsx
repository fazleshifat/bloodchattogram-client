import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Elements } from "@stripe/react-stripe-js";
import FundingForm from "./FundingForm";
import { loadStripe } from "@stripe/stripe-js";
import { FaDonate, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const FundingPage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [fundings, setFundings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [shouldRefetch, setShouldRefetch] = useState(false);

    useEffect(() => {
        const fetchFundings = async () => {
            try {
                const res = await axiosSecure.get(`/fundings?page=${page}&limit=${limit}&email=${user?.email}`);
                setFundings(res.data.fundings);
                setTotal(res.data.total);
            } catch (err) {
                console.error("Failed to load fundings", err);
            }
        };
        if (user?.email) fetchFundings();
    }, [page, showForm, user?.email, shouldRefetch]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-3">
                            Support Our Mission
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My <span className="gradient-text">Fundings</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${showForm
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl'
                            }`}
                    >
                        {showForm ? <><FaTimes className="text-xs" /> Close</> : <><FaDonate className="text-xs" /> Give Fund</>}
                    </button>
                </div>

                {/* Payment Form */}
                {showForm && (
                    <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 shadow-lg">
                        <Elements stripe={stripePromise}>
                            <FundingForm
                                user={user}
                                onDonationSuccess={() => {
                                    setShowForm(false);
                                    setShouldRefetch(prev => !prev);
                                }}
                            />
                        </Elements>
                    </div>
                )}

                {/* Funding Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Funding History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Email</th>
                                    <th className="px-6 py-3 text-left">Amount</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {fundings.length > 0 ? fundings.map((f, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{f.name}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{f.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold text-xs">
                                                ${f.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(f.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-xs text-gray-400 dark:text-gray-500 font-mono">{f.transactionId}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No funding records yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all">
                            <FaChevronLeft className="text-xs" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${i + 1 === page
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md'
                                    : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all">
                            <FaChevronRight className="text-xs" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FundingPage;
