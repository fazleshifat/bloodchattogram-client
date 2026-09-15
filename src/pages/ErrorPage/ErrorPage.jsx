import React, { useEffect } from 'react';
import { Link, useNavigation } from 'react-router';
import Spinner from '../../components/Spinner';
import { FaTint } from 'react-icons/fa';

const ErrorPage = () => {
    const Navigation = useNavigation();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Page Not Found";
    }, []);

    if (Navigation.state === "loading") {
        return <Spinner />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen animated-gradient text-center px-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-6 float">
                <FaTint className="text-4xl text-red-500" />
            </div>

            <h1 className="text-8xl md:text-9xl font-black gradient-text mb-2">404</h1>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                Page Not Found
            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>

            <Link
                to="/"
                className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
            >
                Back to Home
            </Link>
        </div>
    );
};

export default ErrorPage;
