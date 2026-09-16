import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import {
    FaTint,
    FaUser,
    FaEnvelope,
    FaLock,
    FaPhone,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation('auth');
    const { createUser, updateUserProfile } = useAuth();
    const { districts } = useLoaderData();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const axios = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = t('register.pageTitle');
    }, [t]);

    useEffect(() => {
        if (selectedDistrict) {
            const districtObj = districts?.find(
                district => district.id == selectedDistrict
            );

            setSelectedDistrictName(districtObj?.name || '');
        } else {
            setSelectedDistrictName('');
        }
    }, [selectedDistrict, districts]);

    const onSubmit = async data => {
        // Phone validation
        if (!/^1\d{9}$/.test(phoneNumber)) {
            return Swal.fire(
                'Invalid Phone Number',
                'Phone number must start with 1 and contain exactly 10 digits.',
                'error'
            );
        }

        try {
            setSubmitting(true);

            // Create Firebase account
            await createUser(data.email, data.password);

            // Update Firebase profile
            await updateUserProfile({
                displayName: data.name,
            });

            // Save user to backend
            const userInfo = {
                name: data.name,
                email: data.email,
                phone: `+880${phoneNumber}`,
                created_at: new Date().toISOString(),
                role: 'donor',
                blood_group: data.blood_group,
                status: 'active',
                district: selectedDistrictName,
                area: data.area || '',
            };

            await axios.post('/users', userInfo);

            await Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'Your account has been created successfully.',
                timer: 1800,
                showConfirmButton: false,
            });

            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);

            Swal.fire(
                'Registration Failed',
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong. Please try again.',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        'w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-3 focus:ring-red-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-red-500 dark:focus:bg-gray-750';

    const labelClass =
        'mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300';

    const iconInputClass =
        'w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-3 focus:ring-red-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-red-500 dark:focus:bg-white dark:focus:ring-red-500/10';

    const RequiredMark = () => (
        <span className="ml-0.5 text-red-500">*</span>
    );

    return (
        <div className="min-h-[90vh] px-4 py-8 sm:py-12">
            <div className="mx-auto my-auto w-full max-w-2xl">
                {/* CARD */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20">

                    {/* HEADER */}
                    <div className="border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-7">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                <FaTint className="text-lg" />
                            </div>

                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    {t('register.createAccount')}
                                </h1>

                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                    {t('register.fillDetails')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="px-5 py-6 sm:px-7 sm:py-7"
                    >
                        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">

                            {/* NAME */}
                            <div>
                                <label className={labelClass}>
                                    Full Name
                                    <RequiredMark />
                                </label>

                                <div className="relative">
                                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

                                    <input
                                        {...register('name', {
                                            required: true,
                                        })}
                                        type="text"
                                        placeholder="Enter your full name"
                                        className={iconInputClass}
                                    />
                                </div>

                                {errors.name && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {t('register.nameRequired')}
                                    </p>
                                )}
                            </div>

                            {/* PHONE */}
                            <div>
                                <label className={labelClass}>
                                    Phone Number
                                </label>

                                <div className="relative flex items-center">
                                    <FaPhone className="absolute left-3.5 z-10 text-xs text-gray-400" />

                                    <span className="absolute left-9 z-10 text-sm font-medium text-gray-600 dark:text-gray-300">
                                        +880
                                    </span>

                                    <input
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                        })}
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        required
                                        placeholder="1XXXXXXXXX"
                                        value={phoneNumber}
                                        onChange={e => {
                                            const value = e.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 10);

                                            setPhoneNumber(value);

                                            setValue('phone', value, {
                                                shouldValidate: true,
                                            });
                                        }}
                                        className={`${iconInputClass} pl-[4.8rem]`}
                                    />
                                </div>

                                <p className="mt-1 text-[11px] text-gray-400">
                                    Start with 1 and enter 10 digits
                                </p>
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className={labelClass}>
                                    Email
                                    <RequiredMark />
                                </label>

                                <div className="relative">
                                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

                                    <input
                                        {...register('email', {
                                            required: true,
                                        })}
                                        type="email"
                                        placeholder="Enter your email"
                                        className={iconInputClass}
                                    />
                                </div>

                                {errors.email && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {t('register.emailRequired')}
                                    </p>
                                )}
                            </div>

                            {/* BLOOD GROUP */}
                            <div>
                                <label className={labelClass}>
                                    Blood Group
                                    <RequiredMark />
                                </label>

                                <select
                                    {...register('blood_group', {
                                        required: true,
                                    })}
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select blood group
                                    </option>

                                    {[
                                        'A+',
                                        'A-',
                                        'B+',
                                        'B-',
                                        'AB+',
                                        'AB-',
                                        'O+',
                                        'O-',
                                    ].map(group => (
                                        <option key={group} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select>

                                {errors.blood_group && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {t('register.bloodGroupRequired')}
                                    </p>
                                )}
                            </div>

                            {/* DISTRICT */}
                            <div>
                                <label className={labelClass}>
                                    District
                                    <RequiredMark />
                                </label>

                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

                                    <select
                                        {...register('district', {
                                            required: true,
                                        })}
                                        onChange={e =>
                                            setSelectedDistrict(
                                                e.target.value
                                            )
                                        }
                                        className={`${iconInputClass} appearance-none`}
                                    >
                                        <option value="">
                                            Select district
                                        </option>

                                        {districts?.map(district => (
                                            <option
                                                key={district.id}
                                                value={district.id}
                                            >
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {errors.district && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {t('register.districtRequired')}
                                    </p>
                                )}
                            </div>

                            {/* AREA / THANA / UPAZILA / ROAD */}
                            <div>
                                <label className={labelClass}>
                                    Area / Thana / Upazila / Road
                                </label>

                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

                                    <input
                                        {...register('area')}
                                        type="text"
                                        placeholder="Enter area, thana, upazila or road"
                                        className={iconInputClass}
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className={labelClass}>
                                    Password
                                    <RequiredMark />
                                </label>

                                <div className="relative">
                                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

                                    <input
                                        {...register('password', {
                                            required: true,
                                            minLength: 6,
                                        })}
                                        type="password"
                                        placeholder="Minimum 6 characters"
                                        className={iconInputClass}
                                    />
                                </div>

                                {errors.password?.type === 'required' && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {t('register.passwordRequired')}
                                    </p>
                                )}

                                {errors.password?.type === 'minLength' && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {t('register.passwordMinLength')}
                                    </p>
                                )}
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <label className={labelClass}>
                                    Confirm Password
                                    <RequiredMark />
                                </label>

                                <div className="relative">
                                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

                                    <input
                                        {...register(
                                            'confirm_password',
                                            {
                                                required: true,
                                                validate: value =>
                                                    value ===
                                                    watch('password') ||
                                                    t(
                                                        'register.confirmPasswordMismatch'
                                                    ),
                                            }
                                        )}
                                        type="password"
                                        placeholder="Re-enter your password"
                                        className={iconInputClass}
                                    />
                                </div>

                                {errors.confirm_password && (
                                    <p className="mt-1 text-[11px] text-red-500">
                                        {errors.confirm_password.message ||
                                            t(
                                                'register.confirmPasswordRequired'
                                            )}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <FaTint />
                                        {t('register.createAccount')}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* LOGIN */}
                        <div className="mt-5 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t('register.alreadyHaveAccount')}{' '}

                                <Link
                                    to="/login"
                                    className="font-semibold text-red-600 hover:underline dark:text-red-400"
                                >
                                    {t('register.signIn')}
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;