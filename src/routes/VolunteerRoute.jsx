import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/userUserRole';
import Spinner from '../components/Spinner';

const VolunteerRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();
    const location = useLocation();

    if (roleLoading) {
        return <Spinner />
    }

    if (user && role === 'volunteer') {
        return children;
    }

    return <Navigate to="/forbiddenOnlyVolunteer" state={{ from: location }} replace />;
};

export default VolunteerRoute;