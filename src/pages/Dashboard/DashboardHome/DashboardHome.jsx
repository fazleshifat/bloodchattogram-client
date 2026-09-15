import React, { useEffect, useState } from 'react';
import useUserRole from '../../../hooks/userUserRole';
import DonorDashboardHome from '../DonorDashboard/DonorDashboardHome/DonorDashboardHome';
import Profile from '../SharedDashboardPage/Profile/Profile';
import AdminDashboardHome from '../AdminDashboard/AdminDashboardHome/AdminDashboardHome';

const DashboardHome = () => {

    const { role } = useUserRole();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Dropvein | Dashboard`;
    }, []);

    return (
        <>
            {/* Admin Home Dashboard */}
            {(role === 'admin' || role === 'volunteer') && (
                <AdminDashboardHome></AdminDashboardHome>
            )}

            {/* Home Dashboard for DONOR */}
            {
                role === 'donor' &&
                <>
                    <DonorDashboardHome></DonorDashboardHome>
                </>
            }



        </>
    );
};

export default DashboardHome;