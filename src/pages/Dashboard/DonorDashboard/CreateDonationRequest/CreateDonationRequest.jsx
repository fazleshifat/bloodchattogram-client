import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaTint, FaUser, FaEnvelope, FaHospital, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCommentMedical } from 'react-icons/fa';

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

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axiosSecure.get(`/donor/role?email=${user?.email}`);
                const userData = res.data?.[0];
                if (userData) setUserInfo(userData);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };
        fetchUserInfo();
    }, [userInfo]);

    useEffect(() => {
        const fetchLocationData = async () => {
            const districtRes = await fetch('/districts.json');
            const upazilaRes = await fetch('/upazilas.json');
            setDistricts(await districtRes.json());
            setUpazilas(await upazilaRes.json());
        };
        fetchLocationData();
    }, []);

    useEffect(() => {
        if (selectedDistrictId) {
            setFilteredUpazilas(upazilas.filter(u => u.district_id === selectedDistrictId));
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrictId, upazilas]);

    useEffect(() => {
        setSelectedDistrict(districts?.filter(d => d.id == selectedDistrictId));
    }, [selectedDistrictId]);

    const mutation = useMutation({
        mutationFn: async (formData) => axiosSecure.post('/create-donation-requests', formData),
        onSuccess: () => {
            Swal.fire('Success!', 'Donation request created.', 'success');
            reset();
            navigate('/dashboard/my-donation-requests');
        },
        onError: () => Swal.fire('Error!', 'Something went wrong.', 'error')
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

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Create Donation Request";
    }, []);

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200 text-sm";
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";
    const selectClass = inputClass;

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Donation Request</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to request blood for a patient in need.</p>
                </div>

                {userInfo?.status === 'blocked' && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl p-5 flex items-center gap-3">
                        <FaTint className="text-red-500 text-xl flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">Your account is blocked. You cannot request blood at this time.</p>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <fieldset disabled={userInfo?.status === 'blocked'} className="contents">

                            {/* Requester Info (readonly) */}
                            <div>
                                <label className={labelClass}><FaUser className="inline text-gray-400 mr-1 text-xs" /> Requester Name</label>
                                <input type="text" readOnly value={user?.displayName || ''} className={`${inputClass} bg-gray-100 dark:bg-gray-800 cursor-not-allowed`} {...register('requesterName')} />
                            </div>
                            <div>
                                <label className={labelClass}><FaEnvelope className="inline text-gray-400 mr-1 text-xs" /> Requester Email</label>
                                <input type="email" readOnly value={user?.email || ''} className={`${inputClass} bg-gray-100 dark:bg-gray-800 cursor-not-allowed`} {...register('requesterEmail')} />
                            </div>

                            {/* Recipient Info */}
                            <div>
                                <label className={labelClass}><FaUser className="inline text-red-400 mr-1 text-xs" /> Recipient Name</label>
                                <input type="text" placeholder="Patient's full name" className={inputClass} {...register('recipientName', { required: true })} />
                            </div>
                            <div>
                                <label className={labelClass}><FaTint className="inline text-red-400 mr-1 text-xs" /> Blood Group</label>
                                <select {...register('bloodGroup', { required: true })} className={selectClass}>
                                    <option value="">Select Blood Group</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                        <option key={g}>{g}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className={labelClass}><FaMapMarkerAlt className="inline text-red-400 mr-1 text-xs" /> District</label>
                                <select {...register('recipientDistrict', { required: true })} className={selectClass}>
                                    <option value="">Select District</option>
                                    {districts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}><FaMapMarkerAlt className="inline text-red-400 mr-1 text-xs" /> Upazila</label>
                                <select {...register('recipientUpazila', { required: true })} className={selectClass}>
                                    <option value="">Select Upazila</option>
                                    {filteredUpazilas.map(u => (
                                        <option key={u.id} value={u.name}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Hospital */}
                            <div>
                                <label className={labelClass}><FaHospital className="inline text-red-400 mr-1 text-xs" /> Hospital Name</label>
                                <input type="text" placeholder="Hospital name" className={inputClass} {...register('hospitalName', { required: true })} />
                            </div>
                            <div>
                                <label className={labelClass}><FaMapMarkerAlt className="inline text-red-400 mr-1 text-xs" /> Full Address</label>
                                <input type="text" placeholder="Full address" className={inputClass} {...register('fullAddressLine', { required: true })} />
                            </div>

                            {/* Date & Time */}
                            <div>
                                <label className={labelClass}><FaCalendarAlt className="inline text-red-400 mr-1 text-xs" /> Donation Date</label>
                                <input type="date" className={inputClass} {...register('donationDate', { required: true })} />
                            </div>
                            <div>
                                <label className={labelClass}><FaClock className="inline text-red-400 mr-1 text-xs" /> Donation Time</label>
                                <input type="time" className={inputClass} {...register('donationTime', { required: true })} />
                            </div>

                            {/* Message */}
                            <div className="md:col-span-2">
                                <label className={labelClass}><FaCommentMedical className="inline text-red-400 mr-1 text-xs" /> Request Message</label>
                                <textarea placeholder="Describe the urgency and any additional details..." className={`${inputClass} resize-none`} {...register('requestMessage', { required: true })} rows={4} />
                            </div>

                            {/* Submit */}
                            <div className="md:col-span-2 pt-2">
                                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                                    <FaTint className="text-sm" /> Request Blood
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateDonationRequest;
