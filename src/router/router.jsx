import {
    createBrowserRouter,
} from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Authentications/Login";
import Register from "../pages/Authentications/Register";
import CreateDonationRequest from "../pages/Dashboard/DonorDashboard/CreateDonationRequest/CreateDonationRequest";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import EditDonationRequest from "../pages/Dashboard/SharedDashboardPage/EditDonationRequest/EditDonationRequest";
import MyDonationRequest from "../pages/Dashboard/DonorDashboard/MyDonationRequest/MyDonationRequest";
import Profile from "../pages/Dashboard/SharedDashboardPage/Profile/Profile";
import AllDonationRequests from "../pages/Dashboard/SharedDashboardPage/AllDonationRequest/AllDonationRequest";
import AllUsers from "../pages/Dashboard/AdminDashboard/AllUsers/AllUsers";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminRoute from "../routes/AdminRoute";
import VolunteerRoute from "../routes/VolunteerRoute";
import ForbiddenPage from "../pages/ForbiddenPage/ForbiddenPage";
import SpecialRoute from "../routes/SpecialRoute";
import DonationRequestDetails from "../pages/Dashboard/SharedDashboardPage/DonationRequestDetails/DonationRequestDetails";
import BloodDonationRequests from "../pages/BloodDonationRequest/BloodDonationRequest";
import ContentManagement from "../pages/Dashboard/SharedDashboardPage/ContentManagement/ContentManagement";
import AddBlog from "../pages/Dashboard/AdminDashboard/AddBlog/AddBlog";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Blogs from "../pages/Blogs/Blogs";
import BlogDetails from "../pages/BlogDetails/BlogDetails";
import SearchDonors from "../pages/SearchDonors/SearchDonor";
import Inbox from "../pages/Dashboard/AdminDashboard/Inbox/Inbox";


export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/forbidden',
                Component: ForbiddenPage
            },
            {
                path: 'blood-donation-requests',
                Component: BloodDonationRequests
            },
            {
                path: 'blogs',
                Component: Blogs
            },
            {
                path: 'blogs/:id',
                Component: BlogDetails
            },
            {
                path: 'search-donors',
                loader: async () => {
                    const [districtsRes, upazilasRes] = await Promise.all([
                        fetch('/districts.json'),
                        fetch('/upazilas.json'),
                    ]);

                    const [districts, upazilas] = await Promise.all([
                        districtsRes.json(),
                        upazilasRes.json()
                    ]);

                    return { districts, upazilas };
                },
                Component: SearchDonors
            },

            {
                path: 'donation-details/:id',
                element: <PrivateRoute>
                    <DonationRequestDetails></DonationRequestDetails>
                </PrivateRoute>
            },
        ]
    },

    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                loader: async () => {
                    const [districtsRes, upazilasRes] = await Promise.all([
                        fetch('/districts.json'),
                        fetch('/upazilas.json'),
                    ]);

                    const [districts, upazilas] = await Promise.all([
                        districtsRes.json(),
                        upazilasRes.json()
                    ]);

                    return { districts, upazilas };
                },
                Component: Register
            },
        ]
    },

    {
        path: 'dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            {
                index: true,
                Component: DashboardHome
            },
            {
                path: 'profile',
                loader: async () => {
                    const [districtsRes, upazilasRes] = await Promise.all([
                        fetch('/districts.json'),
                        fetch('/upazilas.json'),
                    ]);

                    const [districts, upazilas] = await Promise.all([
                        districtsRes.json(),
                        upazilasRes.json()
                    ]);

                    return { districts, upazilas };
                },
                Component: Profile
            },
            {
                path: 'my-donation-requests',
                Component: MyDonationRequest
            },
            {
                path: 'create-donation-request',
                Component: CreateDonationRequest
            },
            {
                path: 'edit-donation/:id',
                loader: async () => {
                    const [districtsRes, upazilasRes] = await Promise.all([
                        fetch('/districts.json'),
                        fetch('/upazilas.json'),
                    ]);

                    const [districts, upazilas] = await Promise.all([
                        districtsRes.json(),
                        upazilasRes.json()
                    ]);

                    return { districts, upazilas };
                },
                Component: EditDonationRequest
            },

            // ADMIN related routes
            {
                path: 'all-users',
                element: <AdminRoute>
                    <AllUsers></AllUsers>
                </AdminRoute>
            },
            {
                path: 'all-blood-donation-request',
                element: <SpecialRoute>
                    <AllDonationRequests></AllDonationRequests>
                </SpecialRoute>
            },
            {
                path: 'content-management',
                element: <SpecialRoute>
                    <ContentManagement></ContentManagement>
                </SpecialRoute>
            },
            {
                path: 'content-management/add-blog',
                element: <SpecialRoute>
                    <AddBlog></AddBlog>
                </SpecialRoute>
            },

            {
                path: 'inbox',
                element: <SpecialRoute>
                    <Inbox />
                </SpecialRoute>
            },

        ]
    },
    {
        path: '*',
        Component: ErrorPage
    }
]);