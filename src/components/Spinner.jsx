import React from 'react';
import { FaTint } from 'react-icons/fa';

const Spinner = () => {
    return (
        <div className="h-[90vh] w-full flex flex-col items-center justify-center gap-4 animated-gradient">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-red-200 dark:border-red-900/40 border-t-red-500 animate-spin"></div>
                <FaTint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-lg" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
        </div>
    );
};

export default Spinner;
