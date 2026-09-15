import React, { useEffect, useState } from 'react';
import { FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Spinner from '../../../../components/Spinner';

const USERS_PER_PAGE = 10;

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get('/users').then(res => setUsers(res.data)).finally(() => setLoading(false));
    }, [axiosSecure]);

    useEffect(() => { window.scrollTo(0, 0); document.title = "Dropvein | All Users"; }, []);

    const handleBlock = async (user) => {
        const result = await Swal.fire({ title: 'Block this user?', text: `Block ${user.name || 'this user'}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Yes, block' });
        if (result.isConfirmed) { try { const res = await axiosSecure.patch(`/users/status/${user._id}`, { status: 'blocked' }); if (res.data.modifiedCount > 0) { setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: 'blocked' } : u)); Swal.fire('Blocked!', 'User has been blocked.', 'success'); } } catch { Swal.fire('Error', 'Failed to block user.', 'error'); } }
    };
    const handleUnblock = async (user) => {
        const result = await Swal.fire({ title: 'Unblock this user?', icon: 'question', showCancelButton: true, confirmButtonColor: '#16a34a', confirmButtonText: 'Yes, unblock' });
        if (result.isConfirmed) { try { const res = await axiosSecure.patch(`/users/status/${user._id}`, { status: 'active' }); if (res.data.modifiedCount > 0) { setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: 'active' } : u)); Swal.fire('Unblocked!', 'User is now active.', 'success'); } } catch { Swal.fire('Error', 'Failed to unblock user.', 'error'); } }
    };
    const handleMakeDonor = async (user) => {
        const result = await Swal.fire({ title: 'Change role to Donor?', icon: 'info', showCancelButton: true, confirmButtonText: 'Yes, make donor' });
        if (result.isConfirmed) { try { const res = await axiosSecure.patch(`/users/role/${user._id}`, { role: 'donor' }); if (res.data.modifiedCount > 0) { setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: 'donor' } : u)); Swal.fire('Updated!', 'User is now a donor.', 'success'); } } catch { Swal.fire('Error', 'Failed to update role.', 'error'); } }
    };
    const handleMakeVolunteer = async (user) => {
        const result = await Swal.fire({ title: 'Change role to Volunteer?', icon: 'info', showCancelButton: true, confirmButtonText: 'Yes, make volunteer' });
        if (result.isConfirmed) { try { const res = await axiosSecure.patch(`/users/role/${user._id}`, { role: 'volunteer' }); if (res.data.modifiedCount > 0) { setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: 'volunteer' } : u)); Swal.fire('Updated!', 'User is now a volunteer.', 'success'); } } catch { Swal.fire('Error', 'Failed to update role.', 'error'); } }
    };
    const handleMakeAdmin = async (user) => {
        const result = await Swal.fire({ title: 'Make this user Admin?', icon: 'info', showCancelButton: true, confirmButtonText: 'Yes, make admin' });
        if (result.isConfirmed) { try { const res = await axiosSecure.patch(`/users/role/${user._id}`, { role: 'admin' }); if (res.data.modifiedCount > 0) { setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: 'admin' } : u)); Swal.fire('Updated!', 'User is now an admin.', 'success'); } } catch { Swal.fire('Error', 'Failed to update role.', 'error'); } }
    };
    const handleDelete = async (userId) => {
        const result = await Swal.fire({ title: 'Delete this user?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Yes, delete' });
        if (result.isConfirmed) { try { const res = await axiosSecure.delete(`/users/${userId}`); if (res.data.deletedCount > 0) setUsers(users.filter(u => u._id !== userId)); } catch (e) { console.error(e); } }
    };

    const filteredUsers = users.filter(user => filterStatus === 'all' ? true : user.status === filterStatus);
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const startIdx = (currentPage - 1) * USERS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIdx, startIdx + USERS_PER_PAGE);

    if (loading) return <Spinner />;

    const statusColors = {
        active: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        blocked: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    const roleColors = {
        admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        volunteer: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        donor: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Users</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{users.length} registered users</p>
                </div>
                <select
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 w-48"
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                >
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-center">Role</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-center">Update Role</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {currentUsers.map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                    <td className="px-4 py-3 text-gray-500">{startIdx + index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user?.photoURL} className="w-9 h-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-600 object-cover" alt="" />
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{user.name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{user.email}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleColors[user.role] || roleColors.donor}`}>
                                            {user.role || 'donor'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[user.status] || statusColors.active}`}>
                                            {user.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="dropdown dropdown-end">
                                            <button tabIndex={0} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                                <BsThreeDots className="text-gray-500 text-lg" />
                                            </button>
                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 w-48">
                                                {user.status === "active" && (
                                                    <li><button className="text-red-600 text-sm" onClick={() => handleBlock(user)}>Block User</button></li>
                                                )}
                                                {user.status === "blocked" && (
                                                    <li><button className="text-green-600 text-sm" onClick={() => handleUnblock(user)}>Unblock User</button></li>
                                                )}
                                                {user.role === "donor" && (
                                                    <li><button className="text-blue-600 text-sm" onClick={() => handleMakeVolunteer(user)}>Make Volunteer</button></li>
                                                )}
                                                {(user.role === "donor" || user.role === "volunteer") && (
                                                    <>
                                                        <li><button className="text-purple-600 text-sm" onClick={() => handleMakeAdmin(user)}>Make Admin</button></li>
                                                        <li><button className="text-red-600 text-sm" onClick={() => handleMakeDonor(user)}>Make Donor</button></li>
                                                    </>
                                                )}
                                                {user.role === "admin" && (
                                                    <>
                                                        <li><button className="text-red-600 text-sm" onClick={() => handleMakeDonor(user)}>Make Donor</button></li>
                                                        <li><button className="text-blue-600 text-sm" onClick={() => handleMakeVolunteer(user)}>Make Volunteer</button></li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => handleDelete(user._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {users.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No users found.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all">
                        <FaChevronLeft className="text-xs" />
                    </button>
                    {[...Array(totalPages).keys()].map(n => (
                        <button key={n} onClick={() => setCurrentPage(n + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === n + 1 ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            {n + 1}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all">
                        <FaChevronRight className="text-xs" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllUsers;
