/**
 * @file Dashboard.jsx
 * @description User dashboard layout component with sidebar navigation
 * @module pages/Dashboard
 * 
 * Renders the main dashboard layout with sidebar and content area.
 * Displays loading state while fetching auth and profile data.
 * Uses React Router Outlet for nested dashboard routes like profile,
 * enrolled courses, settings, and instructor-specific pages.
 */

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'
import Loading from '../components/common/Loading'
import { ACCOUNT_TYPE } from '../utils/constants'

const Dashboard = () => {

    const { loading: authLoading } = useSelector((state) => state.auth);
    const { loading: profileLoading, user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const location = useLocation();


    if (profileLoading || authLoading) {
        return (
            <div className='mt-10'>
                <Loading />
            </div>
        )
    }

    // Redirect to appropriate dashboard based on account type
    useEffect(() => {
        console.log("Dashboard - Current path:", location.pathname);
        console.log("Dashboard - User:", user);
        console.log("Dashboard - User accountType:", user?.accountType);
        
        if (user && location.pathname === '/dashboard') {
            if (user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
                console.log("Dashboard - Redirecting to instructor dashboard");
                navigate('/dashboard/instructor');
            } else {
                console.log("Dashboard - Redirecting to my-profile");
                navigate('/dashboard/my-profile');
            }
        }
    }, [user, location.pathname, navigate]);

    // Scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className='relative flex min-h-[calc(100vh-3.5rem)] '>
            <Sidebar />

            <div className='h-[calc(100vh-3.5rem)] overflow-auto w-full'>
                <div className='mx-auto w-11/12 max-w-[1000px] py-10 '>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
