import { use } from 'react';
// import useAxiosSecure from './useAxiosSecure';
import { AuthContext } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
    const { user, isLoading: authLoading } = use(AuthContext);
    // const axiosSecure = useAxiosSecure();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();

    const { data: role = 'donor', isLoading: roleLoading, refetch } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}/role`);
            return res.data.role;
        }
    });

    return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;