import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import {
    FaTint,
    FaUser,
    FaEnvelope,
    FaHospital,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaCommentMedical,
    FaArrowRight,
    FaHeart,
    FaShieldAlt,
    FaCheckCircle
} from 'react-icons/fa';

const CreateDonationRequest = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, reset } = useForm();

    const [userInfo, setUserInfo] = useState({});
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const districtName = selectedDistrict[0]?.name;

    const selectedDistrictId = watch('recipientDistrict');

    /* ============================================================
       FETCH USER INFO
    ============================================================ */
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user?.email) return;

            try {
                const res = await axiosSecure.get(
                    `/donor/role?email=${user.email}`
                );

                const userData = res.data?.[0];

                if (userData) {
                    setUserInfo(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, [user?.email, axiosSecure]);

    /* ============================================================
       FETCH LOCATION DATA
    ============================================================ */
    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const districtRes = await fetch('/districts.json');
                const upazilaRes = await fetch('/upazilas.json');

                setDistricts(await districtRes.json());
                setUpazilas(await upazilaRes.json());
            } catch (error) {
                console.error('Failed to load location data:', error);
            }
        };

        fetchLocationData();
    }, []);

    /* ============================================================
       FILTER UPAZILA
    ============================================================ */
    useEffect(() => {
        if (selectedDistrictId) {
            setFilteredUpazilas(
                upazilas.filter(
                    u => u.district_id === selectedDistrictId
                )
            );
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrictId, upazilas]);

    /* ============================================================
       GET SELECTED DISTRICT
    ============================================================ */
    useEffect(() => {
        setSelectedDistrict(
            districts?.filter(d => d.id == selectedDistrictId)
        );
    }, [selectedDistrictId, districts]);

    /* ============================================================
       CREATE REQUEST
    ============================================================ */
    const mutation = useMutation({
        mutationFn: async (formData) =>
            axiosSecure.post('/create-donation-requests', formData),

        onSuccess: () => {
            Swal.fire({
                title: 'Request Created!',
                text: 'Your blood donation request has been created successfully.',
                icon: 'success',
                confirmButtonColor: '#dc2626',
            });

            reset();

            navigate('/dashboard/my-donation-requests');
        },

        onError: (error) => {
            console.error(error);

            Swal.fire({
                title: 'Something went wrong!',
                text: 'Unable to create your donation request.',
                icon: 'error',
                confirmButtonColor: '#dc2626',
            });
        }
    });

    const onSubmit = (data) => {
        mutation.mutate({
            ...data,
            requesterName: user?.displayName,
            requesterEmail: user?.email,
            recipientDistrict: districtName,
            donationStatus: 'pending',
        });
    };

    /* ============================================================
       PAGE
    ============================================================ */
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Create Donation Request";
    }, []);

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-red-500 dark:focus:bg-slate-900";

    const readonlyClass =
        "w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400";

    const labelClass =
        "mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300";

    const iconClass = "text-red-500 text-xs";

    const isBlocked = userInfo?.status === 'blocked';

    return (
        <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-3">

            <div className="mx-auto max-w-7xl">

                {/* =====================================================
                    PREMIUM HEADER
                ====================================================== */}
                <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-rose-500 p-5 text-white shadow-2xl shadow-red-500/20 sm:p-6 lg:p-7">

                    {/* Decorative elements */}
                    <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
                    <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-white/5" />

                    <div className="absolute right-6 top-4 hidden opacity-10 sm:block">
                        <FaTint className="text-[150px]" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                                <FaHeart />
                                Blood Request
                            </div>

                            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
                                Create Donation Request
                            </h1>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-red-50 sm:text-sm">
                                Provide the patient details below to connect
                                with a suitable blood donor.
                            </p>

                        </div>

                        <div className="hidden shrink-0 sm:flex">

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                                <FaTint className="text-2xl" />
                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    BLOCKED ACCOUNT
                ====================================================== */}
                {isBlocked && (
                    <div className="mb-6 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/10">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500 dark:bg-red-900/30">
                            <FaShieldAlt />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
                                Account Restricted
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
                                Your account is currently blocked. You cannot
                                create a blood donation request at this time.
                            </p>
                        </div>

                    </div>
                )}


                {/* =====================================================
                    FORM CARD
                ====================================================== */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    {/* Card Header */}
                    <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
                                    Request Information
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Enter accurate information to help donors
                                    respond quickly.
                                </p>

                            </div>

                            <div className="hidden items-center gap-2 text-[10px] font-bold text-slate-400 sm:flex">
                                <FaCheckCircle className="text-emerald-500" />
                                Secure Request
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================== */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-5 sm:p-7"
                    >

                        <fieldset
                            disabled={isBlocked}
                            className="space-y-8"
                        >

                            {/* =================================================
                                REQUESTER
                            ================================================== */}
                            <div>

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                        <FaUser className="text-xs" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                            Requester Information
                                        </h3>

                                        <p className="text-[11px] text-slate-400">
                                            Your account information
                                        </p>
                                    </div>

                                </div>


                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    <div>

                                        <label className={labelClass}>
                                            <FaUser className="text-slate-400" />
                                            Requester Name
                                        </label>

                                        <input
                                            type="text"
                                            readOnly
                                            value={user?.displayName || ''}
                                            className={readonlyClass}
                                            {...register('requesterName')}
                                        />

                                    </div>


                                    <div>

                                        <label className={labelClass}>
                                            <FaEnvelope className="text-slate-400" />
                                            Requester Email
                                        </label>

                                        <input
                                            type="email"
                                            readOnly
                                            value={user?.email || ''}
                                            className={readonlyClass}
                                            {...register('requesterEmail')}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />


                            {/* =================================================
                                PATIENT
                            ================================================== */}
                            <div>

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                        <FaTint className="text-xs" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                            Patient Information
                                        </h3>

                                        <p className="text-[11px] text-slate-400">
                                            Who needs the blood?
                                        </p>
                                    </div>

                                </div>


                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* Recipient Name */}
                                    <div>

                                        <label className={labelClass}>
                                            <FaUser className={iconClass} />
                                            Recipient Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Patient's full name"
                                            className={inputClass}
                                            {...register('recipientName', {
                                                required: true
                                            })}
                                        />

                                    </div>


                                    {/* Blood Group */}
                                    <div>

                                        <label className={labelClass}>
                                            <FaTint className={iconClass} />
                                            Blood Group
                                        </label>

                                        <select
                                            {...register('bloodGroup', {
                                                required: true
                                            })}
                                            className={inputClass}
                                        >

                                            <option value="">
                                                Select Blood Group
                                            </option>

                                            {[
                                                'A+',
                                                'A-',
                                                'B+',
                                                'B-',
                                                'AB+',
                                                'AB-',
                                                'O+',
                                                'O-'
                                            ].map(g => (
                                                <option key={g}>
                                                    {g}
                                                </option>
                                            ))}

                                        </select>

                                    </div>

                                </div>

                            </div>


                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />


                            {/* =================================================
                                LOCATION
                            ================================================== */}
                            <div>

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                        <FaMapMarkerAlt className="text-xs" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                            Location Details
                                        </h3>

                                        <p className="text-[11px] text-slate-400">
                                            Where is blood needed?
                                        </p>
                                    </div>

                                </div>


                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* District */}
                                    <div>

                                        <label className={labelClass}>
                                            <FaMapMarkerAlt className={iconClass} />
                                            District
                                        </label>

                                        <select
                                            {...register('recipientDistrict', {
                                                required: true
                                            })}
                                            className={inputClass}
                                        >

                                            <option value="">
                                                Select District
                                            </option>

                                            {districts.map(d => (
                                                <option
                                                    key={d.id}
                                                    value={d.id}
                                                >
                                                    {d.name}
                                                </option>
                                            ))}

                                        </select>

                                    </div>


                                    {/* Upazila */}
                                    <div>

                                        <label className={labelClass}>
                                            <FaMapMarkerAlt className={iconClass} />
                                            Upazila
                                        </label>

                                        <select
                                            {...register('recipientUpazila', {
                                                required: true
                                            })}
                                            className={inputClass}
                                            disabled={!selectedDistrictId}
                                        >

                                            <option value="">
                                                {selectedDistrictId
                                                    ? 'Select Upazila'
                                                    : 'Select District First'}
                                            </option>

                                            {filteredUpazilas.map(u => (
                                                <option
                                                    key={u.id}
                                                    value={u.name}
                                                >
                                                    {u.name}
                                                </option>
                                            ))}

                                        </select>

                                    </div>

                                </div>

                            </div>


                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />


                            {/* =================================================
                                HOSPITAL
                            ================================================== */}
                            <div>

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                        <FaHospital className="text-xs" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                            Hospital Information
                                        </h3>

                                        <p className="text-[11px] text-slate-400">
                                            Where should the donor go?
                                        </p>
                                    </div>

                                </div>


                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* Hospital */}
                                    <div>

                                        <label className={labelClass}>
                                            <FaHospital className={iconClass} />
                                            Hospital Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Hospital name"
                                            className={inputClass}
                                            {...register('hospitalName', {
                                                required: true
                                            })}
                                        />

                                    </div>


                                    {/* Address */}
                                    <div>

                                        <label className={labelClass}>
                                            <FaMapMarkerAlt className={iconClass} />
                                            Full Address
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Full hospital address"
                                            className={inputClass}
                                            {...register('fullAddressLine', {
                                                required: true
                                            })}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />


                            {/* =================================================
                                DATE TIME
                            ================================================== */}
                            <div>

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                        <FaCalendarAlt className="text-xs" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                            Donation Schedule
                                        </h3>

                                        <p className="text-[11px] text-slate-400">
                                            When is the blood required?
                                        </p>
                                    </div>

                                </div>


                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* Date */}
                                    <div>

                                        <label className={labelClass}>
                                            <FaCalendarAlt className={iconClass} />
                                            Donation Date
                                        </label>

                                        <input
                                            type="date"
                                            className={inputClass}
                                            {...register('donationDate', {
                                                required: true
                                            })}
                                        />

                                    </div>


                                    {/* Time */}
                                    <div>

                                        <label className={labelClass}>
                                            <FaClock className={iconClass} />
                                            Donation Time
                                        </label>

                                        <input
                                            type="time"
                                            className={inputClass}
                                            {...register('donationTime', {
                                                required: true
                                            })}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />


                            {/* =================================================
                                MESSAGE
                            ================================================== */}
                            <div>

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                        <FaCommentMedical className="text-xs" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                            Additional Information
                                        </h3>

                                        <p className="text-[11px] text-slate-400">
                                            Help donors understand the situation
                                        </p>
                                    </div>

                                </div>


                                <textarea
                                    rows={5}
                                    placeholder="Describe the urgency, patient condition, or any additional information that may help the donor..."
                                    className={`${inputClass} resize-none`}
                                    {...register('requestMessage', {
                                        required: true
                                    })}
                                />

                            </div>


                            {/* =================================================
                                SUBMIT
                            ================================================== */}
                            <div className="border-t border-slate-100 pt-6 dark:border-slate-800">

                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {mutation.isPending ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Creating Request...
                                        </>
                                    ) : (
                                        <>
                                            <FaTint />
                                            Request Blood
                                            <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                                        </>
                                    )}

                                </button>

                                <p className="mt-3 text-center text-[10px] text-slate-400">
                                    Please make sure all patient and hospital
                                    information is accurate before submitting.
                                </p>

                            </div>

                        </fieldset>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default CreateDonationRequest;