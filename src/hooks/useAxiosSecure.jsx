import axios from 'axios';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: `https://dropvein-server.vercel.app`,
});

const useAxiosSecure = () => {
    const { user } = useAuth();
    const auth = getAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(async config => {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    axiosSecure.interceptors.response.use(res => res, error => {
        const status = error?.response?.status;
        if (status === 403) {
            navigate('/forbidden');
        } else if (status === 401) {
            auth.signOut().then(() => {
                navigate('/login');
            });
        }
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosSecure;
