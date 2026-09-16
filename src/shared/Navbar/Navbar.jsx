import { Link, NavLink, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { FaBars, FaHome, FaPlusCircle, FaRegListAlt, FaSignOutAlt, FaTimes, FaTint, FaUser } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../../components/ThemeToggle';
import BookingButton from '../../components/HomeComponent/BookingButton/BookingButton';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { MdDashboard } from 'react-icons/md';

const Navbar = () => {
    const { t } = useTranslation(['navigation', 'common']);
    const { user, loading, userLogOut } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: t('logoutConfirm.title'),
            text: t('logoutConfirm.text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: t('logoutConfirm.confirm'),
            cancelButtonText: t('logoutConfirm.cancel'),
        }).then((result) => {
            if (result.isConfirmed) {
                userLogOut();
                setMobileOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: t('logoutConfirm.successTitle'),
                    text: t('logoutConfirm.successText'),
                    timer: 2000,
                    showConfirmButton: false,
                });
                navigate('/login');
            }
        });
    };

    const navLinkClass = ({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive
            ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
            : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/10'
        }`;

    return (
        <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'glass-nav shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
            : 'bg-base-100/95 dark:bg-gray-900/95 border-b border-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <img
                                src="/assets/login.png"
                                alt="Logo"
                                className="w-9 h-9 object-contain rounded-full ring-2 ring-red-100 dark:ring-red-900/40 group-hover:ring-red-300 dark:group-hover:ring-red-700 transition-all"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </div>
                        <span className="text-xl font-bold tracking-tight gradient-text">
                            {t('common:brand.name')}
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" className={navLinkClass} end>{t('home')}</NavLink>
                        <NavLink to="/blood-donation-requests" className={navLinkClass}>{t('donationRequests')}</NavLink>
                        <NavLink to="/blogs" className={navLinkClass}>{t('stories')}</NavLink>
                        {user && <NavLink to="/dashboard" className={navLinkClass}>{t('dashboard')}</NavLink>}
                        <BookingButton />
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />

                        {!loading && (
                            <>
                                {!user ? (
                                    <div className="hidden md:flex items-center gap-2">
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all"
                                        >
                                            {t('register')}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="hidden md:block dropdown dropdown-end">
                                        <div
                                            tabIndex={0}
                                            className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                        >
                                            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-red-200 dark:ring-red-800">
                                                <img
                                                    src={
                                                        user?.photoURL && user.photoURL !== ''
                                                            ? user.photoURL
                                                            : 'https://i.ibb.co/5GzXkwq/user.png'
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <FiChevronDown className="text-gray-500 text-sm" />
                                        </div>
                                        <div
                                            tabIndex={0}
                                            className="dropdown-content mt-3 p-4 bg-base-100 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-56 z-[1]"
                                        >
                                            <div className="text-center pb-3 border-b border-gray-200 dark:border-gray-700">
                                                <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 ring-2 ring-red-200 dark:ring-red-800">
                                                    <img
                                                        src={
                                                            user?.photoURL && user.photoURL !== ''
                                                                ? user.photoURL
                                                                : 'https://i.ibb.co/5GzXkwq/user.png'
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                                    {user?.displayName}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            <div className="pt-3 space-y-2">
                                                <Link
                                                    to="/dashboard"
                                                    className="block w-full text-center py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg transition-all"
                                                >
                                                    {t('dashboard')}
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    {t('logout')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                        </button>
                    </div>
                </div>
            </div>



            {/* Mobile Menu */}
            <div
                className={`
        md:hidden overflow-hidden transition-all duration-300 ease-in-out
        ${mobileOpen
                        ? 'max-h-[600px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }
    `}
            >
                <div className="px-4 pb-5 pt-3 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">

                    {/* Navigation */}
                    <div className="space-y-1">

                        {/* Home */}
                        <NavLink
                            to="/"
                            end
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => `
                    group flex items-center gap-3 px-3 py-3 rounded-xl
                    text-sm font-semibold transition-all duration-200
                    ${isActive
                                    ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                                }
                `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`
                                w-10 h-10 rounded-xl flex items-center justify-center
                                transition-all
                                ${isActive
                                                ? 'bg-red-100 dark:bg-red-500/15'
                                                : 'bg-gray-100 dark:bg-gray-900'
                                            }
                            `}
                                    >
                                        <FaHome
                                            className={`
                                    text-base
                                    ${isActive
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }
                                `}
                                        />
                                    </span>

                                    <span className="flex-1">
                                        {t('home')}
                                    </span>

                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    )}
                                </>
                            )}
                        </NavLink>

                        {/* Donation Requests */}
                        <NavLink
                            to="/blood-donation-requests"
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => `
                    group flex items-center gap-3 px-3 py-3 rounded-xl
                    text-sm font-semibold transition-all duration-200
                    ${isActive
                                    ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                                }
                `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`
                                w-10 h-10 rounded-xl flex items-center justify-center
                                ${isActive
                                                ? 'bg-red-100 dark:bg-red-500/15'
                                                : 'bg-gray-100 dark:bg-gray-900'
                                            }
                            `}
                                    >
                                        <FaTint
                                            className={`
                                    text-base
                                    ${isActive
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }
                                `}
                                        />
                                    </span>

                                    <div className="flex-1">
                                        <span className="block">
                                            {t('donationRequests')}
                                        </span>

                                        <span className="block text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">
                                            Find people who need blood
                                        </span>
                                    </div>

                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    )}
                                </>
                            )}
                        </NavLink>

                        {/* Blog */}
                        <NavLink
                            to="/blogs"
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => `
                    group flex items-center gap-3 px-3 py-3 rounded-xl
                    text-sm font-semibold transition-all duration-200
                    ${isActive
                                    ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                                }
                `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`
                                w-10 h-10 rounded-xl flex items-center justify-center
                                ${isActive
                                                ? 'bg-red-100 dark:bg-red-500/15'
                                                : 'bg-gray-100 dark:bg-gray-900'
                                            }
                            `}
                                    >
                                        <FaRegListAlt
                                            className={`
                                    text-base
                                    ${isActive
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }
                                `}
                                        />
                                    </span>

                                    <span className="flex-1">
                                        {t('stories')}
                                    </span>

                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    )}
                                </>
                            )}
                        </NavLink>

                    </div>

                    {/* Divider */}
                    <div className="my-4 h-px bg-gray-100 dark:bg-gray-800" />

                    {/* Authentication */}
                    {!loading && !user && (
                        <div className="space-y-3">

                            <div className="px-1 mb-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">
                                    Account
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">

                                {/* Login */}
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="
                            flex items-center justify-center gap-2
                            py-3 rounded-xl
                            text-sm font-semibold
                            text-gray-700 dark:text-gray-200
                            bg-gray-50 dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            hover:border-red-200 dark:hover:border-red-900
                            hover:text-red-600 dark:hover:text-red-400
                            transition-all duration-200
                        "
                                >
                                    <FaUser className="text-xs" />
                                    {t('login')}
                                </Link>

                                {/* Register */}
                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="
                            flex items-center justify-center gap-2
                            py-3 rounded-xl
                            text-sm font-semibold text-white
                            bg-gradient-to-r from-red-600 to-rose-600
                            shadow-lg shadow-red-500/20
                            hover:shadow-red-500/30
                            active:scale-[0.98]
                            transition-all duration-200
                        "
                                >
                                    <FaPlusCircle className="text-xs" />
                                    {t('register')}
                                </Link>

                            </div>

                        </div>
                    )}

                    {/* Logged In */}
                    {!loading && user && (
                        <div className="space-y-3">

                            {/* User Card */}
                            <div className="
                    flex items-center gap-3
                    p-3 rounded-2xl
                    bg-gray-50 dark:bg-gray-900
                    border border-gray-100 dark:border-gray-800
                ">

                                <div className="relative shrink-0">

                                    <img
                                        src={user?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                                        alt={''}
                                        className="
                                w-11 h-11
                                rounded-xl
                                object-cover
                                ring-2 ring-white dark:ring-gray-800
                            "
                                    />

                                    <span className="
                            absolute -right-0.5 -bottom-0.5
                            w-3 h-3
                            rounded-full
                            bg-emerald-500
                            border-2 border-gray-50 dark:border-gray-900
                        " />

                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                        {user?.displayName || 'User'}
                                    </p>

                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                        {user?.email}
                                    </p>

                                </div>

                            </div>

                            {/* Dashboard */}
                            <Link
                                to="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="
                        flex items-center justify-center gap-2
                        w-full py-3
                        rounded-xl
                        text-sm font-semibold text-white
                        bg-gradient-to-r from-red-600 to-rose-600
                        shadow-lg shadow-red-500/20
                        hover:shadow-red-500/30
                        active:scale-[0.98]
                        transition-all duration-200
                    "
                            >
                                <MdDashboard className="text-base" />
                                {t('dashboard')}
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="
                        flex items-center justify-center gap-2
                        w-full py-3
                        rounded-xl
                        text-sm font-semibold
                        text-gray-600 dark:text-gray-300
                        bg-gray-50 dark:bg-gray-900
                        border border-gray-200 dark:border-gray-800
                        hover:text-red-600 dark:hover:text-red-400
                        hover:border-red-200 dark:hover:border-red-900
                        active:scale-[0.98]
                        transition-all duration-200
                    "
                            >
                                <FaSignOutAlt className="text-sm" />
                                {t('logout')}
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
