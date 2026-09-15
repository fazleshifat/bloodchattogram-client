import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../../../hooks/useAuth';
import useAxios from '../../../../hooks/useAxios';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const imageHostingKey = import.meta.env.VITE_image_upload_key;
const imageUploadURL = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const AddBlog = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [thumbnailURL, setThumbnailURL] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleThumbnailUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);

        try {
            setUploading(true);
            const res = await axios.post(imageUploadURL, formData);
            const url = res.data?.data?.url;
            // console.log('Image uploaded:', url);
            setThumbnailURL(url);
        } catch (error) {
            console.error('Image upload failed:', error);
            Swal.fire('Error', 'Failed to upload thumbnail', 'error');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Add Blog";
    }, []);


    const onSubmit = async (data) => {
        if (!thumbnailURL) {
            return Swal.fire('Error', 'Thumbnail is required', 'error');
        }
        if (!content) {
            return Swal.fire('Error', 'Content is required', 'error');
        }

        const blogData = {
            title: data.title,
            thumbnail: thumbnailURL,
            content: content,
            authorName: user?.displayName,
            authorEmail: user?.email,
            createdAt: new Date(),
        };

        try {
            const response = await axiosSecure.post('/create-blog', blogData);
            console.log(response.data)
            if (response.data.insertedId) {
                Swal.fire('Success!', 'Blog created successfully', 'success');
                reset();
                setContent('');
                setThumbnailURL('');
                navigate('/dashboard/content-management');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Something went wrong while creating the blog.', 'error');
        }
    };

    return (
        <div className="min-w-10/12 mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-primary">📝 Add New Blog</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white dark:bg-base-200 p-6 rounded-xl shadow">

                {/* Title */}
                <div>
                    <label className="font-medium">Blog Title</label>
                    <input
                        type="text"
                        {...register('title', { required: 'Title is required' })}
                        placeholder="Enter blog title"
                        className="input input-bordered w-full mt-1"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="font-medium">Thumbnail Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="file-input file-input-bordered w-full mt-1"
                    />
                    {uploading && <p className="text-blue-500 text-sm mt-2">Uploading thumbnail...</p>}
                    {thumbnailURL && (
                        <div className="mt-2">
                            <img src={thumbnailURL} alt="Thumbnail" className="w-40 rounded-lg shadow-md" />
                            <p className="text-green-500 text-sm mt-1">Thumbnail uploaded</p>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div>
                    <label className="font-medium">Blog Content</label>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        tabIndex={1}
                        onBlur={newContent => setContent(newContent)}
                        className="border rounded-md"
                    />
                    {!content && <p className="text-red-500 text-sm mt-1">Content is required</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Create Blog'}
                </button>
            </form>
        </div>
    );
};

export default AddBlog;
