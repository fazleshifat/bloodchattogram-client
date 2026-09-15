import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAuth from '../../../../hooks/useAuth';
import useAxios from '../../../../hooks/useAxios';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaUser, FaEnvelope, FaTint, FaMapMarkerAlt, FaCamera, FaEdit, FaTimes, FaShieldAlt } from 'react-icons/fa';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const Profile = () => {
    const { districts, upazilas } = useLoaderData();
    const { user, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const [userInfo, setUserInfo] = useState({});
    const [profilePic, setProfilePic] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedDistrictName, setSelectedDistrictName] = useState(null);
    const [upazilasRes, setUpazilasRes] = useState([]);

    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm();
    const selectedDistrict = watch('district');

    useEffect(() => {
        if (selectedDistrict) {
            const found = districts.find(d => d.name === selectedDistrict);
            if (found) {
                setSelectedDistrictName(found.name);
                setUpazilasRes(upazilas.filter(u => u.district_id === found.id));
            } else {
                setUpazilasRes([]);
            }
        }
    }, [selectedDistrict]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user?.email) return;
            try {
                const res = await axiosSecure.get(`/profile?email=${user?.email}`);
                const userData = res.data?.[0];
                if (userData) {
                    setUserInfo(userData);
                    reset(userData);
                    setProfilePic(userData.photoURL);
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };
        fetchUserInfo();
    }, [user?.email, axios, reset]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Profile";
    }, []);

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image);
        const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
        try {
            setUploading(true);
            const res = await axios.post(uploadUrl, formData);
            setProfilePic(res.data.data.url);
        } catch (error) {
            console.error('Image upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!data.name || !data.blood_group || !data.district || !data.upazila) {
            return Swal.fire('Error', 'All fields are required.', 'error');
        }

        const result = await Swal.fire({
            title: 'Confirm Update',
            text: 'Are you sure you want to update your profile?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, update',
            cancelButtonText: 'Cancel',
            denyButtonText: 'Continue Editing'
        });

        if (result.isConfirmed) {
            const updatedInfo = {
                name: data.name,
                photoURL: profilePic,
                district: data.district,
                upazila: data.upazila,
                blood_group: data.blood_group,
            };
            try {
                await updateUserProfile({ displayName: updatedInfo.name, photoURL: profilePic });
                await axios.patch(`/users/${user.email}`, updatedInfo);
                toast.success('Profile updated!');
                Swal.fire('Success', 'Your profile has been updated.', 'success');
                setIsEditing(false);
            } catch (err) {
                console.error(err);
                toast.error('Update failed!');
                Swal.fire('Error', 'Something went wrong during update.', 'error');
            }
        } else if (result.isDenied) {
            toast('Continue editing...');
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200 text-sm";
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";
    const disabledClass = "bg-gray-100 dark:bg-gray-800 cursor-not-allowed";

    const statusColor = userInfo.status === 'active'
        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';

    const roleColor = {
        admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        volunteer: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        donor: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information</p>
                    </div>
                    <button
                        className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${isEditing
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            : 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/20 hover:from-red-700 hover:to-red-600'
                            }`}
                        onClick={async () => {
                            if (!isEditing) {
                                const result = await Swal.fire({
                                    title: 'Edit Profile?',
                                    text: "You are about to enter edit mode.",
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonColor: '#dc2626',
                                    confirmButtonText: 'Yes, edit',
                                });
                                if (result.isConfirmed) setIsEditing(true);
                            } else {
                                setIsEditing(false);
                            }
                        }}
                    >
                        {isEditing ? <><FaTimes className="text-xs" /> Cancel</> : <><FaEdit className="text-xs" /> Edit Profile</>}
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Avatar Section */}
                    <div className="relative bg-gradient-to-r from-red-600 to-rose-600 p-8 flex flex-col items-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="relative group">
                                <img
                                    src={profilePic || userInfo?.photoURL}
                                    alt="avatar"
                                    className="w-28 h-28 rounded-full ring-4 ring-white/30 object-cover"
                                />
                                {isEditing && (
                                    <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
                                        <FaCamera className="text-white text-xl" />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                            {uploading && <p className="text-xs text-red-200 mt-2 font-medium">Uploading...</p>}
                        </div>
                        <h3 className="text-xl font-bold text-white mt-4 relative z-10">{userInfo?.name || user?.displayName}</h3>
                        <p className="text-sm text-red-200 relative z-10">{userInfo?.email}</p>
                        <div className="flex gap-2 mt-3 relative z-10">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor}`}>{userInfo.status}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleColor[userInfo?.role] || roleColor.donor}`}>{userInfo?.role || 'donor'}</span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}><FaShieldAlt className="inline text-gray-400 mr-1 text-xs" /> Role</label>
                                <input type="text" value={userInfo?.role || ''} disabled className={`${inputClass} ${disabledClass} capitalize`} />
                            </div>
                            <div>
                                <label className={labelClass}><FaEnvelope className="inline text-gray-400 mr-1 text-xs" /> Email</label>
                                <input type="email" value={userInfo?.email || ''} disabled className={`${inputClass} ${disabledClass}`} />
                            </div>

                            <div>
                                <label className={labelClass}><FaUser className="inline text-red-400 mr-1 text-xs" /> Name</label>
                                <input type="text" {...register('name', { required: 'Name is required' })} disabled={!isEditing} className={`${inputClass} ${!isEditing ? disabledClass : ''}`} />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className={labelClass}><FaTint className="inline text-red-400 mr-1 text-xs" /> Blood Group</label>
                                {isEditing ? (
                                    <>
                                        <select {...register('blood_group', { required: 'Blood group is required' })} className={inputClass}>
                                            <option value="">Select</option>
                                            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                        {errors.blood_group && <p className="text-red-500 text-xs mt-1">{errors.blood_group.message}</p>}
                                    </>
                                ) : (
                                    <input type="text" value={userInfo?.blood_group || ''} disabled className={`${inputClass} ${disabledClass}`} />
                                )}
                            </div>

                            <div>
                                <label className={labelClass}><FaMapMarkerAlt className="inline text-red-400 mr-1 text-xs" /> District</label>
                                {isEditing ? (
                                    <select {...register('district')} className={inputClass}>
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                                    </select>
                                ) : (
                                    <input type="text" value={userInfo?.district || ''} disabled className={`${inputClass} ${disabledClass}`} />
                                )}
                            </div>

                            <div>
                                <label className={labelClass}><FaMapMarkerAlt className="inline text-red-400 mr-1 text-xs" /> Upazila</label>
                                {isEditing ? (
                                    <select {...register('upazila')} className={inputClass}>
                                        <option value="">Select Upazila</option>
                                        {upazilasRes?.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                    </select>
                                ) : (
                                    <input type="text" value={userInfo?.upazila || ''} disabled className={`${inputClass} ${disabledClass}`} />
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-6">
                                <button type="submit" disabled={uploading} className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300">
                                    {uploading ? 'Uploading...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
