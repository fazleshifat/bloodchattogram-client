import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';

const PrivateRoute = ({ children }) => {

    const { user, loading } = useAuth();

    const location = useLocation();
    if (loading) {
        return (
            <Spinner></Spinner>
        );
    }

    if (user) {
        return children;
    }

    return <Navigate to='/login' state={{ from: location.pathname }} replace />

};

export default PrivateRoute;