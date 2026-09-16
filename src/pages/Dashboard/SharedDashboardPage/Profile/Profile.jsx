import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAuth from '../../../../hooks/useAuth';
import useAxios from '../../../../hooks/useAxios';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import {
    FaUser,
    FaEnvelope,
    FaTint,
    FaMapMarkerAlt,
    FaCamera,
    FaEdit,
    FaTimes,
    FaShieldAlt,
    FaCheckCircle,
    FaMapMarkedAlt,
    FaHeart,
    FaPhone,
    FaTrash,
} from 'react-icons/fa';

const bloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'O+',
    'O-',
    'AB+',
    'AB-',
];

const Profile = () => {
    const { districts, upazilas } = useLoaderData();
    const { user, updateUserProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);

    const axios = useAxios();
    const axiosSecure = useAxiosSecure();

    const [userInfo, setUserInfo] = useState({});
    const [profilePic, setProfilePic] = useState('');
    const [isNewImage, setIsNewImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');

    const [selectedDistrictName, setSelectedDistrictName] =
        useState(null);

    const [upazilasRes, setUpazilasRes] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const selectedDistrict = watch('district');

    // ==========================================
    // DISTRICT → UPAZILA
    // ==========================================

    useEffect(() => {
        if (selectedDistrict) {
            const found = districts.find(
                d => d.name === selectedDistrict
            );

            if (found) {
                setSelectedDistrictName(found.name);

                setUpazilasRes(
                    upazilas.filter(
                        u => u.district_id === found.id
                    )
                );
            } else {
                setUpazilasRes([]);
                setSelectedDistrictName(null);
            }
        } else {
            setUpazilasRes([]);
            setSelectedDistrictName(null);
        }
    }, [selectedDistrict, districts, upazilas]);

    // ==========================================
    // FETCH USER
    // ==========================================

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user?.email) return;

            try {
                const res = await axiosSecure.get(
                    `/profile?email=${user.email}`
                );

                const userData = res.data?.[0];

                if (userData) {
                    setUserInfo(userData);

                    // ------------------------------------------
                    // PHONE ARCHITECTURE
                    // DB:
                    // +8801831694191
                    //
                    // FORM:
                    // 1831694191
                    // ------------------------------------------

                    const fullPhone = userData?.phone || '';

                    const editablePhone =
                        fullPhone.replace(/^\+880/, '');

                    setPhoneNumber(editablePhone);

                    reset({
                        ...userData,
                        phone: editablePhone,
                    });

                    setProfilePic(
                        userData?.photoURL || ''
                    );

                    setIsNewImage(false);
                }
            } catch (error) {
                console.error(
                    'Failed to fetch user info:',
                    error
                );
            }
        };

        fetchUserInfo();
    }, [
        user?.email,
        axiosSecure,
        reset,
    ]);

    // ==========================================
    // PAGE TITLE
    // ==========================================

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Profile';
    }, []);

    // ==========================================
    // IMAGE SELECT - PREVIEW ONLY
    // ==========================================

    const handleImageUpload = e => {
        const image = e.target.files?.[0];

        if (!image) return;

        if (!image.type.startsWith('image/')) {
            toast.error('Please select a valid image.');
            e.target.value = '';
            return;
        }

        if (image.size > 5 * 1024 * 1024) {
            toast.error('Image must be smaller than 5MB.');
            e.target.value = '';
            return;
        }

        // Store the actual file for later upload
        setSelectedImage(image);

        // Show local preview only
        const previewUrl = URL.createObjectURL(image);

        setProfilePic(previewUrl);
        setIsNewImage(true);

        // No ImgBB upload here
    };

    // ==========================================
    // REMOVE SELECTED IMAGE
    // ==========================================

    const handleRemoveImage = () => {
        // Remove the selected file
        setSelectedImage(null);

        // Restore original profile image
        setProfilePic(userInfo?.photoURL || '');

        setIsNewImage(false);
    };

    // ==========================================
    // ENTER EDIT MODE
    // ==========================================

    const handleEditProfile = async () => {
        const result = await Swal.fire({
            title: 'Edit Profile?',
            text: 'You are about to enter edit mode.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, edit',
        });

        if (result.isConfirmed) {
            const editablePhone =
                userInfo?.phone?.replace(
                    /^\+880/,
                    ''
                ) || '';

            setPhoneNumber(editablePhone);

            setValue(
                'phone',
                editablePhone
            );

            reset({
                ...userInfo,
                phone: editablePhone,
            });

            setProfilePic(userInfo?.photoURL || '');

            setSelectedImage(null);

            setIsNewImage(false);

            setIsEditing(true);
        }
    };

    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancel = () => {
        const originalPhone =
            userInfo?.phone?.replace(/^\+880/, '') || '';

        setPhoneNumber(originalPhone);

        reset({
            ...userInfo,
            phone: originalPhone,
        });

        setProfilePic(userInfo?.photoURL || '');

        setSelectedImage(null);

        setIsNewImage(false);

        setIsEditing(false);
    };

    // ==========================================
    // SUBMIT PROFILE
    // ==========================================

    const onSubmit = async data => {
        if (
            !data.name ||
            !phoneNumber ||
            !data.blood_group ||
            !data.district ||
            !data.upazila
        ) {
            return Swal.fire(
                'Error',
                'All fields are required.',
                'error'
            );
        }

        if (!/^1\d{9}$/.test(phoneNumber)) {
            return Swal.fire(
                'Invalid Phone Number',
                'Phone number must start with 1 and contain exactly 10 digits.',
                'error'
            );
        }

        const result = await Swal.fire({
            title: 'Confirm Update',
            text: 'Are you sure you want to update your profile?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, update',
            cancelButtonText: 'Cancel',
            denyButtonText: 'Continue Editing',
        });

        if (result.isDenied) {
            toast('Continue editing...');
            return;
        }

        if (!result.isConfirmed) {
            return;
        }

        try {
            setUploading(true);

            // ==========================================
            // STEP 1: UPLOAD NEW IMAGE ONLY IF SELECTED
            // ==========================================

            let finalPhotoURL = userInfo?.photoURL || '';

            if (selectedImage) {
                const formData = new FormData();

                formData.append('image', selectedImage);

                const uploadResponse = await axiosSecure.post(
                    '/upload-profile-image',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                finalPhotoURL = uploadResponse?.data?.photoURL;

                if (!finalPhotoURL) {
                    throw new Error(
                        'Image upload failed. Image is missing.'
                    );
                }
            }
            // ==========================================
            // STEP 2: PREPARE PROFILE DATA
            // ==========================================

            const updatedInfo = {
                name: data.name,

                photoURL: finalPhotoURL,

                phone: `+880${phoneNumber}`,

                district: data.district,

                upazila: data.upazila,

                blood_group: data.blood_group,
            };

            // ==========================================
            // STEP 3: UPDATE FIREBASE PROFILE
            // ==========================================

            await updateUserProfile({
                displayName: updatedInfo.name,

                photoURL: updatedInfo.photoURL,
            });

            // ==========================================
            // STEP 4: SAVE TO MONGODB
            // ==========================================

            await axiosSecure.patch(
                `/users/${user.email}`,
                updatedInfo
            );

            // ==========================================
            // STEP 5: UPDATE LOCAL STATE
            // ==========================================

            setUserInfo(prev => ({
                ...prev,
                ...updatedInfo,
            }));

            setProfilePic(
                updatedInfo.photoURL
            );

            setSelectedImage(null);

            setIsNewImage(false);

            setPhoneNumber(phoneNumber);

            reset({
                ...updatedInfo,
                phone: phoneNumber,
            });

            toast.success(
                'Profile updated successfully!'
            );

            await Swal.fire({
                title: 'Success',
                text: 'Your profile has been updated.',
                icon: 'success',
                confirmButtonColor: '#dc2626',
            });

            setIsEditing(false);

        } catch (err) {
            console.error(
                'Profile update error:',
                err
            );

            toast.error(
                'Update failed! Your profile was not saved.'
            );

            Swal.fire(
                'Error',
                err?.response?.data?.message ||
                'Something went wrong during profile update.',
                'error'
            );

        } finally {
            setUploading(false);
        }
    };

    // ==========================================
    // DELETE EXISTING PROFILE IMAGE
    // ==========================================

    const handleDeleteImage = async () => {
        const result = await Swal.fire({
            title: 'Delete Profile Picture?',
            text: 'Are you sure you want to delete your profile picture?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setUploading(true);

            // ==========================================
            // DELETE IMAGE FROM BACKEND + IMGBB + MONGODB
            // ==========================================

            await axiosSecure.delete(
                `/users/${user.email}/profile-image`
            );

            // ==========================================
            // UPDATE FIREBASE PROFILE
            // ==========================================

            await updateUserProfile({
                displayName:
                    userInfo?.name ||
                    user?.displayName ||
                    '',
                photoURL: '',
            });

            // ==========================================
            // UPDATE LOCAL STATE
            // ==========================================

            setUserInfo(prev => ({
                ...prev,
                photoURL: '',
                photoDeleteURL: '',
            }));

            setProfilePic('');

            setSelectedImage(null);

            setIsNewImage(false);

            toast.success(
                'Profile picture deleted successfully!'
            );

            await Swal.fire({
                title: 'Deleted',
                text: 'Your profile picture has been removed.',
                icon: 'success',
                confirmButtonColor: '#dc2626',
            });

        } catch (error) {
            console.error(
                'Profile image delete error:',
                error
            );

            toast.error(
                'Failed to delete profile picture.'
            );

            Swal.fire(
                'Error',
                error?.response?.data?.message ||
                'Something went wrong while deleting your profile picture.',
                'error'
            );

        } finally {
            setUploading(false);
        }
    };


    // ==========================================
    // STYLES
    // ==========================================

    const inputClass = `
        w-full
        px-4 py-3
        rounded-xl
        border
        border-gray-200
        dark:border-gray-700
        bg-gray-50
        dark:bg-gray-900
        text-gray-800
        dark:text-gray-200
        text-sm
        outline-none
        transition-all
        duration-200
        focus:border-red-400
        focus:ring-4
        focus:ring-red-500/10
    `;

    const labelClass = `
        flex
        items-center
        gap-2
        text-xs
        font-bold
        uppercase
        tracking-wider
        text-gray-500
        dark:text-gray-400
        mb-2
    `;

    const disabledClass =
        'bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-500';

    const statusColor =
        userInfo.status === 'active'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';

    const roleColor = {
        admin:
            'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',

        volunteer:
            'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',

        donor:
            'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    };

    const currentRole =
        userInfo?.role || 'donor';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">

            <div className="max-w-5xl mx-auto">

                {/* ==========================================
                    PAGE HEADER
                ========================================== */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                    <div>
                        <div className="flex items-center gap-2 mb-1">

                            <span className="w-8 h-1 rounded-full bg-red-600" />

                            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-red-500">
                                Account
                            </span>

                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                            My Profile
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage your personal information and donor identity.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`
                            inline-flex items-center justify-center gap-2
                            px-5 py-3
                            rounded-xl
                            text-sm font-bold
                            transition-all duration-300
                            ${isEditing
                                ? `
                                    bg-gray-200
                                    dark:bg-gray-800
                                    text-gray-700
                                    dark:text-gray-300
                                    hover:bg-gray-300
                                    dark:hover:bg-gray-700
                                `
                                : `
                                    bg-gradient-to-r
                                    from-red-600
                                    to-rose-600
                                    text-white
                                    shadow-lg
                                    shadow-red-500/20
                                    hover:shadow-xl
                                    hover:shadow-red-500/30
                                    hover:-translate-y-0.5
                                `
                            }
                        `}
                        onClick={
                            isEditing
                                ? handleCancel
                                : handleEditProfile
                        }
                    >
                        {isEditing ? (
                            <>
                                <FaTimes />
                                Cancel
                            </>
                        ) : (
                            <>
                                <FaEdit />
                                Edit Profile
                            </>
                        )}
                    </button>

                </div>

                {/* ==========================================
                    PROFILE HERO
                ========================================== */}

                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">

                    {/* Decorative background */}

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">

                        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-500/10 blur-3xl" />

                        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl" />

                        <div className="absolute top-0 right-0 w-72 h-72 opacity-[0.035]">

                            <svg
                                viewBox="0 0 200 200"
                                className="w-full h-full"
                            >
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />

                                <circle
                                    cx="100"
                                    cy="100"
                                    r="55"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />

                            </svg>

                        </div>

                    </div>

                    <div className="relative p-6 sm:p-8 lg:p-10">

                        <div className="flex flex-col lg:flex-row lg:items-center gap-8">

                            {/* ==========================================
                                AVATAR
                            ========================================== */}

                            <div className="flex justify-center lg:justify-start">

                                <div className="relative">

                                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 opacity-20 blur-md" />

                                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-br from-red-500 via-rose-500 to-red-700 shadow-xl">

                                        <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900 p-1">

                                            <img
                                                src={
                                                    profilePic ||
                                                    userInfo?.photoURL ||
                                                    user?.photoURL ||
                                                    'https://i.ibb.co/5GzXkwq/user.png'
                                                }
                                                alt="Profile"
                                                className="w-full h-full object-cover rounded-full"
                                            />

                                        </div>

                                    </div>


                                    {/* ==========================================
                                    IMAGE ACTION BUTTONS
                                    ========================================== */}

                                    {isEditing && (
                                        <>
                                            {/* ==========================================
            NEW IMAGE PREVIEW → SHOW CROSS
        ========================================== */}

                                            {isNewImage && selectedImage ? (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="
                    absolute
                    top-0
                    right-0
                    w-8
                    h-8
                    rounded-full
                    bg-red-600
                    text-white
                    flex
                    items-center
                    justify-center
                    border-4
                    border-white
                    dark:border-gray-900
                    cursor-pointer
                    shadow-lg
                    hover:bg-red-700
                    hover:scale-105
                    transition-all
                    z-10
                "
                                                    title="Remove selected image"
                                                >
                                                    <FaTimes className="text-xs" />
                                                </button>
                                            ) : (
                                                /* ==========================================
                                                    EXISTING IMAGE → SHOW DELETE
                                                ========================================== */

                                                userInfo?.photoURL && (
                                                    <button
                                                        type="button"
                                                        onClick={handleDeleteImage}
                                                        disabled={uploading}
                                                        className="
                        absolute
                        top-0
                        right-0
                        w-8
                        h-8
                        rounded-full
                        bg-red-600
                        text-white
                        flex
                        items-center
                        justify-center
                        border-4
                        border-white
                        dark:border-gray-900
                        cursor-pointer
                        shadow-lg
                        hover:bg-red-700
                        hover:scale-105
                        transition-all
                        z-10
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                                                        title="Delete profile picture"
                                                    >
                                                        <FaTrash className="text-xs" />
                                                    </button>
                                                )
                                            )}

                                            {/* ==========================================
            CAMERA BUTTON
        ========================================== */}

                                            <label
                                                className="
                absolute
                bottom-1
                right-1
                w-11
                h-11
                rounded-full
                bg-red-600
                text-white
                flex
                items-center
                justify-center
                border-4
                border-white
                dark:border-gray-900
                cursor-pointer
                shadow-lg
                hover:bg-red-700
                hover:scale-105
                transition-all
            "
                                            >
                                                <FaCamera className="text-sm" />

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </>
                                    )}



                                    {/* Verified */}

                                    {!isEditing && (
                                        <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white dark:border-gray-900">
                                            <FaCheckCircle className="text-xs" />
                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* ==========================================
                                PROFILE INFO
                            ========================================== */}

                            <div className="flex-1 text-center lg:text-left">

                                <div className="flex flex-col lg:flex-row lg:items-center gap-3">

                                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                                        {userInfo?.name ||
                                            user?.displayName ||
                                            'User'}
                                    </h3>

                                    <div className="flex justify-center lg:justify-start gap-2">

                                        <span
                                            className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}
                                        >
                                            {userInfo?.status ||
                                                'inactive'}
                                        </span>

                                        <span
                                            className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${roleColor[currentRole] || roleColor.donor}`}
                                        >
                                            {currentRole}
                                        </span>

                                    </div>

                                </div>

                                <p className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">

                                    <FaEnvelope className="text-xs text-red-400" />

                                    {userInfo?.email ||
                                        user?.email}

                                </p>

                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 max-w-xl">

                                    Your profile helps BloodChattogram connect you with the right blood donation opportunities in your community.

                                </p>

                                {uploading && (
                                    <div className="flex items-center justify-center lg:justify-start gap-2 mt-4">

                                        <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />

                                        <span className="text-xs font-semibold text-red-500">
                                            Uploading profile image...
                                        </span>

                                    </div>
                                )}

                            </div>

                        </div>

                        {/* ==========================================
                            QUICK INFO
                        ========================================== */}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">

                            {/* Blood */}

                            <div className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/50 p-4 hover:border-red-200 dark:hover:border-red-900/50 transition-all">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <FaTint />
                                    </div>

                                    <div>

                                        <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                                            Blood Group
                                        </p>

                                        <p className="text-lg font-black text-gray-900 dark:text-white">
                                            {userInfo?.blood_group || '--'}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Location */}

                            <div className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/50 p-4 hover:border-red-200 dark:hover:border-red-900/50 transition-all">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <FaMapMarkedAlt />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                                            Location
                                        </p>

                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {userInfo?.district || '--'}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Contribution */}

                            <div className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/50 p-4 hover:border-red-200 dark:hover:border-red-900/50 transition-all">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <FaHeart />
                                    </div>

                                    <div>

                                        <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                                            Community
                                        </p>

                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            N/A
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                    FORM
                ========================================== */}

                <div className="mt-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

                    {/* Form Header */}

                    <div className="px-6 sm:px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">

                        <div>

                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Personal Information
                            </h3>

                            <p className="text-xs text-gray-400 mt-1">

                                {isEditing
                                    ? 'Update your information below.'
                                    : 'Your registered account information.'}

                            </p>

                        </div>

                        {isEditing && (
                            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider">

                                <FaEdit />

                                Editing

                            </span>
                        )}

                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-6 sm:p-8"
                    >

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

                            {/* ROLE */}

                            <div>

                                <label className={labelClass}>
                                    <FaShieldAlt className="text-purple-400" />
                                    Role
                                </label>

                                <div className="relative">

                                    <input
                                        type="text"
                                        value={userInfo?.role || ''}
                                        disabled
                                        className={`${inputClass} ${disabledClass} capitalize`}
                                    />

                                    <FaShieldAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 text-xs" />

                                </div>

                            </div>

                            {/* BLOOD */}

                            <div>

                                <label className={labelClass}>
                                    <FaTint className="text-red-500" />
                                    Blood Group
                                </label>

                                {isEditing ? (
                                    <>

                                        <select
                                            {...register(
                                                'blood_group',
                                                {
                                                    required:
                                                        'Blood group is required',
                                                }
                                            )}
                                            className={`${inputClass} cursor-pointer`}
                                        >

                                            <option value="">
                                                Select blood group
                                            </option>

                                            {bloodGroups.map(
                                                bg => (
                                                    <option
                                                        key={bg}
                                                        value={bg}
                                                    >
                                                        {bg}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        {errors.blood_group && (
                                            <p className="text-red-500 text-xs mt-1.5">
                                                {
                                                    errors
                                                        .blood_group
                                                        .message
                                                }
                                            </p>
                                        )}

                                    </>
                                ) : (
                                    <div className="relative">

                                        <input
                                            type="text"
                                            value={
                                                userInfo?.blood_group ||
                                                ''
                                            }
                                            disabled
                                            className={`${inputClass} ${disabledClass}`}
                                        />

                                        <FaTint className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-xs" />

                                    </div>
                                )}

                            </div>

                            {/* NAME */}

                            <div>

                                <label className={labelClass}>
                                    <FaUser className="text-red-400" />
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    {...register('name', {
                                        required:
                                            'Name is required',
                                    })}
                                    disabled={!isEditing}
                                    className={`${inputClass} ${!isEditing
                                        ? disabledClass
                                        : ''
                                        }`}
                                />

                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.name.message}
                                    </p>
                                )}

                            </div>

                            {/* PHONE */}

                            <div>

                                <label className={labelClass}>
                                    <FaPhone className="text-orange-400" />
                                    Phone
                                </label>

                                {/* VIEW MODE */}

                                {!isEditing ? (
                                    <div
                                        className="
                                            flex
                                            items-center
                                            w-full
                                            px-4
                                            py-3
                                            rounded-xl
                                            border
                                            border-gray-200
                                            dark:border-gray-700
                                            bg-gray-100
                                            dark:bg-gray-800
                                            text-sm
                                            text-gray-500
                                            dark:text-gray-500
                                        "
                                    >

                                        <span className="flex-1">
                                            {userInfo?.phone ||
                                                'No phone number'}
                                        </span>

                                        <FaPhone
                                            className="
                                                shrink-0
                                                ml-2
                                                text-gray-300
                                                dark:text-gray-600
                                                text-xs
                                            "
                                        />

                                    </div>
                                ) : (
                                    /* EDIT MODE */

                                    <div
                                        className="
                                            flex
                                            items-center
                                            w-full
                                            px-4
                                            py-3
                                            rounded-xl
                                            border
                                            border-gray-200
                                            dark:border-gray-700
                                            bg-gray-50
                                            dark:bg-gray-900
                                            text-sm
                                            outline-none
                                            transition-all
                                            duration-200
                                            focus-within:border-red-400
                                            focus-within:ring-4
                                            focus-within:ring-red-500/10
                                        "
                                    >

                                        {/* FIXED COUNTRY CODE */}

                                        <span
                                            className="
                                                shrink-0
                                                text-gray-800
                                                dark:text-gray-200
                                                font-medium
                                            "
                                        >
                                            +880
                                        </span>

                                        {/* ONLY 10 DIGITS */}

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={10}
                                            value={phoneNumber}
                                            placeholder="1XXXXXXXXX"
                                            onChange={e => {
                                                const value =
                                                    e.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ''
                                                        )
                                                        .slice(
                                                            0,
                                                            10
                                                        );

                                                setPhoneNumber(
                                                    value
                                                );

                                                setValue(
                                                    'phone',
                                                    value,
                                                    {
                                                        shouldValidate:
                                                            true,
                                                        shouldDirty:
                                                            true,
                                                    }
                                                );
                                            }}
                                            className="
                                                flex-1
                                                min-w-0
                                                bg-transparent
                                                border-none
                                                outline-none
                                                text-gray-800
                                                dark:text-gray-200
                                                text-sm
                                                ml-1
                                                p-0
                                                focus:ring-0
                                            "
                                        />

                                        <FaPhone
                                            className="
                                                shrink-0
                                                ml-2
                                                text-gray-300
                                                dark:text-gray-600
                                                text-xs
                                                pointer-events-none
                                            "
                                        />

                                    </div>
                                )}

                                {isEditing &&
                                    phoneNumber &&
                                    !/^1\d{9}$/.test(
                                        phoneNumber
                                    ) && (
                                        <p className="text-red-500 text-xs mt-1.5">
                                            Phone number must start with 1 and contain exactly 10 digits
                                        </p>
                                    )}

                            </div>

                            {/* EMAIL */}

                            <div>

                                <label className={labelClass}>
                                    <FaEnvelope className="text-orange-400" />
                                    Email
                                </label>

                                <div className="relative">

                                    <input
                                        type="email"
                                        value={
                                            userInfo?.email ||
                                            ''
                                        }
                                        disabled
                                        className={`${inputClass} ${disabledClass}`}
                                    />

                                    <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 text-xs" />

                                </div>

                            </div>

                            {/* DISTRICT */}

                            <div>

                                <label className={labelClass}>
                                    <FaMapMarkerAlt className="text-orange-400" />
                                    District
                                </label>

                                {isEditing ? (
                                    <select
                                        {...register(
                                            'district',
                                            {
                                                required:
                                                    'District is required',
                                            }
                                        )}
                                        className={`${inputClass} cursor-pointer`}
                                    >

                                        <option value="">
                                            Select district
                                        </option>

                                        {districts.map(
                                            d => (
                                                <option
                                                    key={d.name}
                                                    value={d.name}
                                                >
                                                    {d.name}
                                                </option>
                                            )
                                        )}

                                    </select>
                                ) : (
                                    <div className="relative">

                                        <input
                                            type="text"
                                            value={
                                                userInfo?.district ||
                                                ''
                                            }
                                            disabled
                                            className={`${inputClass} ${disabledClass}`}
                                        />

                                        <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 text-xs" />

                                    </div>
                                )}

                                {errors.district && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.district.message}
                                    </p>
                                )}

                            </div>

                            {/* UPAZILA */}

                            <div>

                                <label className={labelClass}>
                                    <FaMapMarkerAlt className="text-rose-400" />
                                    Upazila
                                </label>

                                {isEditing ? (
                                    <select
                                        {...register(
                                            'upazila',
                                            {
                                                required:
                                                    'Upazila is required',
                                            }
                                        )}
                                        disabled={
                                            !selectedDistrictName
                                        }
                                        className={`${inputClass} cursor-pointer ${!selectedDistrictName
                                            ? disabledClass
                                            : ''
                                            }`}
                                    >

                                        <option value="">
                                            {selectedDistrictName
                                                ? 'Select upazila'
                                                : 'Select district first'}
                                        </option>

                                        {upazilasRes?.map(
                                            u => (
                                                <option
                                                    key={u.id}
                                                    value={u.name}
                                                >
                                                    {u.name}
                                                </option>
                                            )
                                        )}

                                    </select>
                                ) : (
                                    <div className="relative">

                                        <input
                                            type="text"
                                            value={
                                                userInfo?.upazila ||
                                                ''
                                            }
                                            disabled
                                            className={`${inputClass} ${disabledClass}`}
                                        />

                                        <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400 text-xs" />

                                    </div>
                                )}

                                {errors.upazila && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.upazila.message}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* ==========================================
                            SAVE AREA
                        ========================================== */}

                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                                    <div className="flex items-center gap-2 text-xs text-gray-400">

                                        <FaShieldAlt className="text-emerald-500" />

                                        <span>
                                            Your profile information is securely stored.
                                        </span>

                                    </div>

                                    <div className="flex w-full sm:w-auto gap-3">

                                        <button
                                            type="button"
                                            onClick={
                                                handleCancel
                                            }
                                            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading ? (
                                                <span className="flex items-center justify-center gap-2">

                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                                                    {selectedImage
                                                        ? 'Uploading & Saving...'
                                                        : 'Saving...'}

                                                </span>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>

                                    </div>

                                </div>

                            </div>
                        )}

                    </form>

                </div>

                {/* ==========================================
                    FOOTER NOTE
                ========================================== */}

                <div className="flex items-center justify-center gap-2 py-6 text-[11px] text-gray-400 dark:text-gray-600">

                    <FaHeart className="text-red-400" />

                    <span>
                        Every profile helps make blood donation faster and more accessible.
                    </span>

                </div>

            </div>

        </div>
    );
};

export default Profile;