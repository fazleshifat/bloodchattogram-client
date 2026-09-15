import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import Spinner from '../../components/Spinner';
import { FaUser, FaCalendar, FaArrowLeft } from 'react-icons/fa';

const BlogDetails = () => {
    const { id } = useParams();
    const axios = useAxios();
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const { data: blog, isLoading, isError } = useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            const res = await axios.get(`/blogs/${id}`);
            return res.data;
        },
        onError: () => navigate('/blogs')
    });

    useEffect(() => {
        if (blog) document.title = `Dropvein | ${blog.title}`;
    }, [blog]);

    if (isLoading) return <Spinner />;
    if (isError || !blog) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-red-500 text-lg font-medium">Failed to load blog details.</p>
        </div>
    );

    return (
        <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mb-8 transition-colors">
                    <FaArrowLeft className="text-xs" /> Back to Blogs
                </Link>

                {/* Article */}
                <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-lg">
                    {/* Featured Image */}
                    <div className="relative">
                        <img
                            src={blog.thumbnail}
                            alt={blog.title}
                            className="w-full h-64 sm:h-80 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-xs font-semibold uppercase text-red-600 dark:text-red-400 backdrop-blur-sm">
                                {blog.status}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {blog.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
                            <span className="flex items-center gap-2">
                                <FaUser className="text-red-400 text-xs" />
                                <span>{blog.authorName}</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCalendar className="text-red-400 text-xs" />
                                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </span>
                        </div>

                        <div
                            className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-red-600 dark:prose-a:text-red-400"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>
                </article>
            </div>
        </section>
    );
};

export default BlogDetails;
