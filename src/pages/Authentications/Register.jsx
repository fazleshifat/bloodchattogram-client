import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLoaderData, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import { FaTint, FaUser, FaEnvelope, FaLock, FaCamera } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation('auth');
    const { createUser, updateUserProfile } = useAuth();
    const { districts, upazilas } = useLoaderData();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [profilePic, setProfilePic] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const axios = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = t('register.pageTitle');
    }, [t]);

    const filteredUpazilas = upazilas?.filter(u => u.district_id == selectedDistrict);

    useEffect(() => {
        if (selectedDistrict) {
            const districtObj = districts?.find(d => d.id == selectedDistrict);
            setSelectedDistrictName(districtObj?.name || '');
        }
    }, [selectedDistrict, districts]);

    const onSubmit = async (data) => {
        try {
            const result = await createUser(data.email, data.password);
            await updateUserProfile({
                displayName: data.name,
                photoURL: profilePic,
            });
            const userInfo = {
                name: data.name,
                email: data.email,
                photoURL: profilePic,
                created_at: new Date().toISOString(),
                role: 'donor',
                blood_group: data.blood_group,
                status: 'active',
                district: selectedDistrictName,
                upazila: data.upazila,
            };
            await axios.post('/users', userInfo);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

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

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200 text-sm";
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";
    const selectClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200 text-sm";

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-1 py-12">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                {/* Left - Branding (2 cols) */}
                <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center bg-gradient-to-br from-red-700 to-rose-500 p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
                    <div className="relative z-10 text-center space-y-6">
                        <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm float">
                            <FaTint className="text-4xl text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">{t('register.joinHeading')}</h2>
                        <p className="text-red-100 text-sm leading-relaxed max-w-xs mx-auto">
                            {t('register.joinSubtext')}
                        </p>
                        <div className="space-y-3 pt-4 text-left text-sm">
                            {[t('register.perks.track'), t('register.perks.find'), t('register.perks.save')].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                                    <span className="text-red-100">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Form (3 cols) */}
                <div className="md:col-span-3 bg-white dark:bg-gray-800 p-3 md:p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{t('register.createAccount')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('register.fillDetails')}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Profile Upload */}
                        <div className="col-span-2 flex flex-col items-center gap-2 mb-2">
                            <label className="relative cursor-pointer group">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required />
                                {profilePic ? (
                                    <div className="relative">
                                        <img src={profilePic} className="w-24 h-24 object-cover rounded-full ring-3 ring-red-200 dark:ring-red-800" />
                                        <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <FaCamera className="text-white text-lg" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full group-hover:border-red-400 transition-all">
                                        <FaCamera className="text-gray-400 text-lg mb-1" />
                                        <span className="text-[10px] text-gray-400">{t('register.uploadPhoto')}</span>
                                    </div>
                                )}
                            </label>
                            {uploading && <span className="text-xs text-blue-500 font-medium">{t('register.uploading')}</span>}
                            {profilePic && <span className="text-xs text-green-500 font-medium">{t('register.uploaded')}</span>}
                        </div>

                        {/* Name */}
                        <div className="col-span-2">
                            <label className={labelClass}>{t('register.fullName')}</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input {...register('name', { required: true })} type="text" placeholder={t('register.fullNamePlaceholder')} className={`${inputClass} pl-10`} />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{t('register.nameRequired')}</p>}
                        </div>

                        {/* Email */}
                        <div className="col-span-2">
                            <label className={labelClass}>{t('register.email')}</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input {...register('email', { required: true })} type="email" placeholder={t('register.emailPlaceholder')} className={`${inputClass} pl-10`} />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{t('register.emailRequired')}</p>}
                        </div>

                        {/* Blood Group */}
                        <div className="col-span-2">
                            <label className={labelClass}>{t('register.bloodGroup')}</label>
                            <select {...register('blood_group', { required: true })} className={selectClass}>
                                <option value="">{t('register.selectBloodGroup')}</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                            {errors.blood_group && <p className="text-red-500 text-xs mt-1">{t('register.bloodGroupRequired')}</p>}
                        </div>

                        {/* District */}
                        <div className='col-span-2 md:col-span-1'>
                            <label className={labelClass}>{t('register.district')}</label>
                            <select
                                {...register('district', { required: true })}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">{t('register.selectDistrict')}</option>
                                {districts?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            {errors.district && <p className="text-red-500 text-xs mt-1">{t('register.districtRequired')}</p>}
                        </div>

                        {/* Upazila */}
                        <div className='col-span-2 md:col-span-1'>
                            <label className={labelClass}>{t('register.upazila')}</label>
                            <select {...register('upazila', { required: true })} className={selectClass} disabled={!selectedDistrict}>
                                <option value="">{t('register.selectUpazila')}</option>
                                {filteredUpazilas?.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                            </select>
                            {errors.upazila && <p className="text-red-500 text-xs mt-1">{t('register.upazilaRequired')}</p>}
                        </div>

                        {/* Password */}
                        <div className='col-span-2 md:col-span-1'>
                            <label className={labelClass}>{t('register.password')}</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input {...register('password', { required: true, minLength: 6 })} type="password" placeholder={t('register.passwordPlaceholder')} className={`${inputClass} pl-10`} />
                            </div>
                            {errors.password?.type === 'required' && <p className="text-red-500 text-xs mt-1">{t('register.passwordRequired')}</p>}
                            {errors.password?.type === 'minLength' && <p className="text-red-500 text-xs mt-1">{t('register.passwordMinLength')}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className='col-span-2 md:col-span-1'>
                            <label className={labelClass}>{t('register.confirmPassword')}</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input
                                    {...register('confirm_password', {
                                        required: true,
                                        validate: value => value === watch('password') || t('register.confirmPasswordMismatch')
                                    })}
                                    type="password"
                                    placeholder={t('register.confirmPasswordPlaceholder')}
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                            {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message || t('register.confirmPasswordRequired')}</p>}
                        </div>

                        {/* Submit */}
                        <div className="col-span-2 pt-2">
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
                                disabled={uploading}
                            >
                                {uploading ? t('register.pleaseWait') : t('register.createAccount')}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('register.alreadyHaveAccount')}{' '}
                        <Link to="/login" className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                            {t('register.signIn')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
