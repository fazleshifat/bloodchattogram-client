import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router';
import { MdAddBox } from 'react-icons/md';
import useAuth from '../../../../hooks/useAuth';
import useUserRole from '../../../../hooks/userUserRole';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaUser, FaCalendar, FaEye, FaEyeSlash, FaTrash, FaTint } from 'react-icons/fa';

const ContentManagement = () => {
    const { user } = useAuth();
    const { role } = useUserRole();
    const [filter, setFilter] = useState('all');
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    useEffect(() => { window.scrollTo(0, 0); document.title = "Dropvein | Content Management"; }, []);

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['blogs', user?.email],
        queryFn: async () => { const res = await axiosSecure.get(`/all-blogs?email=${user?.email}`); return res.data; }
    });

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
        const confirm = await Swal.fire({
            title: `${newStatus === 'published' ? 'Publish' : 'Unpublish'} this blog?`,
            icon: 'question', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: `Yes, ${newStatus}`
        });
        if (confirm.isConfirmed) {
            updateStatus.mutate({ id, status: newStatus }, {
                onSuccess: () => Swal.fire('Success!', `Blog is now ${newStatus}.`, 'success'),
                onError: () => Swal.fire('Error!', 'Failed to update status.', 'error')
            });
        }
    };

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }) => { const res = await axiosSecure.patch(`/blogs/status/${id}`, { status }); return res.data; },
        onSuccess: () => queryClient.invalidateQueries(['blogs', user?.email])
    });

    const deleteBlog = useMutation({
        mutationFn: async (id) => { const res = await axiosSecure.delete(`/blogs/delete/${id}`); return res.data; },
        onSuccess: () => { queryClient.invalidateQueries(['blogs', user?.email]); Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false }); },
        onError: () => Swal.fire({ icon: 'error', title: 'Failed!', text: 'Could not delete the blog.' })
    });

    const handleDelete = (id) => {
        Swal.fire({ title: 'Delete this blog?', text: "This cannot be undone.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' }).then(r => { if (r.isConfirmed) deleteBlog.mutate(id); });
    };

    const filteredBlogs = filter === 'all' ? blogs : blogs.filter(b => b.status === filter);

    if (isLoading) return <Spinner />;

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage blog posts - publish, unpublish, or delete.</p>
                </div>
                {(role === 'admin' || role === 'volunteer') && (
                    <NavLink
                        to='/dashboard/content-management/add-blog'
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all"
                    >
                        <MdAddBox className="text-lg" /> Add Blog
                    </NavLink>
                )}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {['all', 'draft', 'published'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f
                            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Content */}
            {blogs.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <FaTint className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No blogs created yet.</p>
                </div>
            ) : filteredBlogs.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No blogs found for <strong>"{filter}"</strong> filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogs.map(blog => (
                        <article key={blog._id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden card-hover flex flex-col">
                            <div className="relative overflow-hidden">
                                <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase backdrop-blur-sm ${blog.status === 'published'
                                        ? 'bg-green-100/90 dark:bg-green-900/80 text-green-600 dark:text-green-400'
                                        : 'bg-amber-100/90 dark:bg-amber-900/80 text-amber-600 dark:text-amber-400'
                                        }`}>
                                        {blog.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                    {blog.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    <span className="flex items-center gap-1"><FaUser className="text-red-400" /> {blog.authorName}</span>
                                    <span className="flex items-center gap-1"><FaCalendar className="text-red-400" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1" dangerouslySetInnerHTML={{ __html: blog.content }} />

                                {role === 'admin' && (
                                    <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={() => handleStatusToggle(blog._id, blog.status)}
                                            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${blog.status === 'draft'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                                }`}
                                        >
                                            {blog.status === 'draft' ? <><FaEye className="text-[10px]" /> Publish</> : <><FaEyeSlash className="text-[10px]" /> Unpublish</>}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContentManagement;
