
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const useRecentDonationRequests = () => {
    const { user, loading } = useAuth();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();

    return useQuery({
        queryKey: ['donationRequests', user?.email],
        enabled: !loading && !!user?.email, // only run when user is ready
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-donation-requests?email=${user.email}`);
            return res.data;
        },
    });
};

export default useRecentDonationRequests;
