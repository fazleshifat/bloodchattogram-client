import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return (
        <button
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 border border-gray-200 dark:border-gray-700"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <FaMoon className="text-gray-600 text-sm" />
            ) : (
                <FaSun className="text-yellow-400 text-sm" />
            )}
        </button>
    );
};

export default ThemeToggle;
