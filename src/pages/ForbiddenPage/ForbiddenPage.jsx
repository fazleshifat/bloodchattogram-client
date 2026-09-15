import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/userUserRole';

const ForbiddenPage = () => {
    const { user } = useAuth();
    const { role } = useUserRole();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Forbidden";
    }, []);

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center animated-gradient px-4">
            <div className="max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                    <FaLock className="text-3xl text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    You don't have the required privileges to access this page.
                </p>
                <Link
                    to="/"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl transition-all"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ForbiddenPage;
