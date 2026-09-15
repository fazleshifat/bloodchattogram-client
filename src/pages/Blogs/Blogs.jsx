import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Spinner from '../../components/Spinner';
import { FaArrowRight, FaUser, FaCalendar } from 'react-icons/fa';

const Blogs = () => {
    const axios = useAxios();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Blogs";
    }, []);

    const { data: blogs = [], isLoading, isError } = useQuery({
        queryKey: ['publishedBlogs'],
        queryFn: async () => {
            const res = await axios.get('/all-blogs/public');
            return res.data;
        }
    });

    if (isLoading) return <Spinner />;

    if (isError) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-red-500 text-lg font-medium">Failed to load blogs.</p>
            </div>
        );
    }

    return (
        <section className="py-16 px-6 min-h-[90vh] bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
                        Our Blog
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Latest <span className="gradient-text">Articles</span>
                    </h2>
                    <div className="section-divider"></div>
                </div>

                {blogs.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg py-10">No published blogs available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map(blog => (
                            <article key={blog._id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 card-hover flex flex-col">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-xs font-semibold uppercase text-red-600 dark:text-red-400 backdrop-blur-sm">
                                            {blog.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                        <span className="flex items-center gap-1"><FaUser className="text-red-400" /> {blog.authorName}</span>
                                        <span className="flex items-center gap-1"><FaCalendar className="text-red-400" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div
                                        className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    />
                                    <Link
                                        to={`/blogs/${blog._id}`}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:gap-3 transition-all duration-300 mt-auto"
                                    >
                                        Read More <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Blogs;
