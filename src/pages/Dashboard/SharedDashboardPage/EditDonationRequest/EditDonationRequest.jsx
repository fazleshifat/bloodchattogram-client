import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../../hooks/useAuth';
import { useLoaderData } from 'react-router';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaUser, FaEnvelope, FaTint, FaMapMarkerAlt, FaHospital, FaCalendarAlt, FaClock, FaCommentMedical } from 'react-icons/fa';

const EditDonationRequest = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { districts, upazilas } = useLoaderData();

    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const { register, handleSubmit, reset, watch } = useForm();

    const selectedDistrict = watch('recipientDistrict');

    useEffect(() => {
        const match = districts.find(d => d.name === selectedDistrict);
        if (match) {
            setFilteredUpazilas(upazilas.filter(u => u.district_id === match.id));
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrict]);

    useEffect(() => {
        axiosSecure.get(`/donation-requests/${id}`).then(res => reset(res.data));
    }, [id, reset]);

    const onSubmit = async (updateData) => {
        try {
            await axiosSecure.patch(`/donation-requests/${id}`, updateData);
            Swal.fire('Updated!', 'Donation request updated successfully.', 'success');
            navigate(-1);
        } catch (err) {
            Swal.fire('Error', 'Failed to update donation request', 'error');
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Edit Donation Request";
    }, []);

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200 text-sm";
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

    return (
        <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Edit Donation Request</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update the details of this blood donation request.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}><FaUser className="inline text-gray-400 mr-1 text-xs" /> Requester Name</label>
                            <input value={user?.displayName || ""} readOnly className={`${inputClass} bg-gray-100 dark:bg-gray-800 cursor-not-allowed`} />
                        </div>
                        <div>
                            <label className={labelClass}><FaEnvelope className="inline text-gray-400 mr-1 text-xs" /> Requester Email</label>
                            <input value={user?.email || ""} readOnly className={`${inputClass} bg-gray-100 dark:bg-gray-800 cursor-not-allowed`} />
                        </div>

                        <div>
                            <label className={labelClass}><FaUser className="inline text-red-400 mr-1 text-xs" /> Recipient Name</label>
                            <input {...register('recipientName')} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}><FaTint className="inline text-red-400 mr-1 text-xs" /> Blood Group</label>
                            <select {...register('bloodGroup', { required: true })} className={inputClass}>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}><FaMapMarkerAlt className="inline text-red-400 mr-1 text-xs" /> District</label>
                            <select {...register('recipientDistrict')} className={inputClass}>
                                <option value="">Select District</option>
                                {districts.map(d => (
                                    <option key={d.name} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}><FaMapMarkerAlt className="inline text-red-400 mr-1 text-xs" /> Upazila</label>
                            <select {...register('recipientUpazila')} className={inputClass}>
                                <option value="">Select Upazila</option>
                                {filteredUpazilas.map(u => (
                                    <option key={u.id} value={u.name}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}><FaHospital className="inline text-red-400 mr-1 text-xs" /> Hospital Name</label>
                            <input {...register('hospitalName')} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}><FaMapMarkerAlt className="inline text-red-400 mr-1 text-xs" /> Full Address</label>
                            <input {...register('fullAddressLine')} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}><FaCalendarAlt className="inline text-red-400 mr-1 text-xs" /> Donation Date</label>
                            <input {...register('donationDate')} type="date" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}><FaClock className="inline text-red-400 mr-1 text-xs" /> Donation Time</label>
                            <input {...register('donationTime')} type="time" className={inputClass} />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}><FaCommentMedical className="inline text-red-400 mr-1 text-xs" /> Request Message</label>
                            <textarea {...register('requestMessage')} className={`${inputClass} resize-none`} rows={4} />
                        </div>

                        <div className="md:col-span-2 pt-2">
                            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                                <FaTint className="text-sm" /> Update Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDonationRequest;
