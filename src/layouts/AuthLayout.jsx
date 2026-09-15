import React from 'react';
import { Outlet } from 'react-router';
import Spinner from '../components/Spinner';
import Navbar from '../shared/Navbar/Navbar';


const AuthLayout = () => {

    return (
        <>
            <Navbar></Navbar>
            <div className="max-w-7xl mx-auto">
                {/* <Spinner></Spinner> */}

                <div className="px-1 flex-col lg:flex-row-reverse">
                    {/* <div className='flex-1'>
                        <img
                            src="/assets/login.png"
                            className="max-w-sm rounded-lg shadow-2xl"
                        />
                    </div> */}
                    <div className='flex-1'>
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthLayout;