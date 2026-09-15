import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../shared/Navbar/Navbar';
import Footer from '../shared/Footer/Footer';
import ChannelTalk from '../components/HomeComponent/ChannelTalk/ChannelTalk';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-base-100 dark:bg-gray-900">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <ChannelTalk />
            <Footer />
        </div>
    );
};

export default MainLayout;
