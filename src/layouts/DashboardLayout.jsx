import { NavLink, Outlet, Link } from 'react-router';
import {
    MdDashboard,
    MdLibraryBooks,
    MdAnalytics,
} from 'react-icons/md';
import {
    FaUsers,
    FaDonate,
    FaRegListAlt,
    FaPlusCircle,
    FaUser,
    FaInbox,
    FaHome,
    FaChevronRight,
    FaHeart,
    FaCircle,
} from 'react-icons/fa';

import BloodChattogramLogo from '../shared/Logo/BloodChattogramLogo';
import useUserRole from '../hooks/userUserRole';
import ThemeToggle from '../components/ThemeToggle';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role, isLoading } = useUserRole();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-red-500"></span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    const linkClass = ({ isActive }) =>
        `
        group relative flex items-center gap-3
        px-3.5 py-2.5
        rounded-xl
        text-sm font-medium
        transition-all duration-200
        ${isActive
            ? `
                bg-red-50 dark:bg-red-500/10
                text-red-600 dark:text-red-400
                `
            : `
                text-slate-600 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                hover:text-slate-900 dark:hover:text-white
                `
        }
        `;

    const SidebarSection = ({ title, children }) => (
        <div className="mb-5">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                {title}
            </p>

            <div className="space-y-1">
                {children}
            </div>
        </div>
    );

    const NavItem = ({ to, icon: Icon, children, end = false }) => (
        <NavLink to={to} end={end} className={linkClass}>
            {({ isActive }) => (
                <>
                    {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-red-500 rounded-r-full" />
                    )}

                    <span
                        className={`
                            w-9 h-9
                            rounded-lg
                            flex items-center justify-center
                            transition-all
                            ${isActive
                                ? 'bg-red-100 dark:bg-red-500/15'
                                : 'bg-transparent group-hover:bg-slate-200/70 dark:group-hover:bg-slate-700'
                            }
                        `}
                    >
                        <Icon
                            className={`
                                text-[17px]
                                ${isActive
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                                }
                            `}
                        />
                    </span>

                    <span className="flex-1">
                        {children}
                    </span>

                    {isActive && (
                        <FaChevronRight className="text-[10px] text-red-400" />
                    )}
                </>
            )}
        </NavLink>
    );

    return (
        <div className="drawer lg:drawer-open">

            <input
                id="my-drawer-2"
                type="checkbox"
                className="drawer-toggle peer"
            />

            {/* ================= MAIN CONTENT ================= */}
            <div className="drawer-content flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">

                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 h-16 flex items-center justify-between px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">

                    <div className="flex items-center gap-3">

                        <label
                            htmlFor="my-drawer-2"
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-slate-600 dark:text-slate-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </label>

                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                Dashboard
                            </p>

                            <p className="text-[10px] capitalize text-slate-400">
                                {role}
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center gap-2">

                        <ThemeToggle />

                        <img
                            src={
                                user?.photoURL && user.photoURL !== ''
                                    ? user.photoURL
                                    : 'https://i.ibb.co/5GzXkwq/user.png'
                            }
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                        />

                    </div>

                </header>

                {/* Page Content */}
                <main className="flex-1">
                    <Outlet />
                </main>

            </div>

            {/* ================= SIDEBAR ================= */}
            <div className="drawer-side z-50">

                <label
                    htmlFor="my-drawer-2"
                    className="drawer-overlay"
                />

                <aside className="w-[280px] min-h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">

                    {/* Logo */}
                    <div className="h-[76px] flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">

                        <BloodChattogramLogo />

                        <div className="hidden lg:block">
                            <ThemeToggle />
                        </div>

                    </div>

                    {/* User Profile */}
                    <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">

                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">

                            <div className="relative shrink-0">

                                <img
                                    src={
                                        user?.photoURL && user.photoURL !== ''
                                            ? user.photoURL
                                            : 'https://i.ibb.co/5GzXkwq/user.png'
                                    }
                                    className="w-11 h-11 rounded-xl object-cover"
                                />

                                <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />

                            </div>

                            <div className="min-w-0 flex-1">

                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {user?.displayName || 'User'}
                                </p>

                                <div className="flex items-center gap-1.5 mt-1">

                                    <FaCircle className="text-[5px] text-emerald-500" />

                                    <span className="text-[11px] capitalize font-medium text-slate-500 dark:text-slate-400">
                                        {role || 'User'}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin">

                        <SidebarSection title="Overview">

                            <NavItem
                                to="/dashboard"
                                end
                                icon={MdDashboard}
                            >
                                Dashboard
                            </NavItem>

                            <NavItem
                                to="/dashboard/profile"
                                icon={FaUser}
                            >
                                My Profile
                            </NavItem>

                        </SidebarSection>

                        <SidebarSection title="Donation">

                            <NavItem
                                to="/dashboard/my-donation-requests"
                                icon={FaRegListAlt}
                            >
                                My Donation Requests
                            </NavItem>

                            <NavItem
                                to="/dashboard/create-donation-request"
                                icon={FaPlusCircle}
                            >
                                Create Blood Request
                            </NavItem>

                        </SidebarSection>

                        {/* Admin */}
                        {role === 'admin' && (
                            <SidebarSection title="Administration">

                                <NavItem
                                    to="/dashboard/all-users"
                                    icon={FaUsers}
                                >
                                    All Users
                                </NavItem>

                                <NavItem
                                    to="/dashboard/all-blood-donation-request"
                                    icon={FaDonate}
                                >
                                    Blood Requests
                                </NavItem>

                                <NavItem
                                    to="/dashboard/content-management"
                                    icon={MdLibraryBooks}
                                >
                                    Content Management
                                </NavItem>

                                <NavItem
                                    to="/dashboard/inbox"
                                    icon={FaInbox}
                                >
                                    Inbox
                                </NavItem>

                            </SidebarSection>
                        )}

                        {/* Volunteer */}
                        {role === 'volunteer' && (
                            <SidebarSection title="Management">

                                <NavItem
                                    to="/dashboard/all-blood-donation-request"
                                    icon={FaDonate}
                                >
                                    Blood Requests
                                </NavItem>

                                <NavItem
                                    to="/dashboard/content-management"
                                    icon={MdLibraryBooks}
                                >
                                    Content Management
                                </NavItem>

                            </SidebarSection>
                        )}

                        {/* Analytics placeholder */}
                        {(role === 'admin' || role === 'volunteer') && (
                            <SidebarSection title="Insights">

                                <NavItem
                                    to="/dashboard"
                                    icon={MdAnalytics}
                                >
                                    Analytics
                                </NavItem>

                            </SidebarSection>
                        )}

                    </nav>

                    {/* Sidebar Bottom */}
                    <div className="p-3 border-t border-slate-100 dark:border-slate-800">

                        {/* Impact Card */}
                        <div className="mb-3 p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/5 border border-red-100 dark:border-red-500/10">

                            <div className="flex items-center gap-2 mb-2">

                                <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
                                    <FaHeart className="text-red-500 text-xs" />
                                </div>

                                <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                                    Make an Impact
                                </span>

                            </div>

                            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                Every donation can help save a life.
                            </p>

                        </div>

                        <Link
                            to="/"
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center">
                                <FaHome className="text-[16px]" />
                            </span>

                            <span>
                                Back to Website
                            </span>
                        </Link>

                    </div>

                </aside>

            </div>

        </div>
    );
};

export default DashboardLayout;