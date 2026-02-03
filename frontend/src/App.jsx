/**
 * @file App.jsx
 * @description Main application component with optimized routing and lazy loading
 * @module App
 * 
 * Configures React Router routes with code splitting for faster page loads.
 * Uses React.lazy() for route-based code splitting and Suspense for loading states.
 * Includes navbar, scroll-to-top functionality, and token cleanup.
 */

import { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Eager load critical components
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";
import { ACCOUNT_TYPE } from './utils/constants';
import { HiArrowNarrowUp } from "react-icons/hi"

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"))
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"))
const About = lazy(() => import("./pages/About"))
const Contact = lazy(() => import("./pages/Contact"))
const PageNotFound = lazy(() => import("./pages/PageNotFound"))
const CourseDetails = lazy(() => import("./pages/CourseDetails"))
const Catalog = lazy(() => import("./pages/Catalog"))
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"))
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const ViewCourse = lazy(() => import("./pages/ViewCourse"))

// Lazy load dashboard components
const MyProfile = lazy(() => import("./components/core/Dashboard/MyProfile"))
const Settings = lazy(() => import("./components/core/Dashboard/Settings/Settings"))
const MyCourses = lazy(() => import("./components/core/Dashboard/MyCourses"))
const EditCourse = lazy(() => import("./components/core/Dashboard/EditCourse/EditCourse"))
const Instructor = lazy(() => import("./components/core/Dashboard/Instructor"))
const Cart = lazy(() => import("./components/core/Dashboard/Cart/Cart"))
const EnrolledCourses = lazy(() => import("./components/core/Dashboard/EnrolledCourses"))
const AddCourse = lazy(() => import("./components/core/Dashboard/AddCourse/AddCourse"))
const VideoDetails = lazy(() => import("./components/core/ViewCourse/VideoDetails"))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-richblack-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-50"></div>
  </div>
)


function App() {

  const { user } = useSelector((state) => state.profile)

  // Scroll to the top of the page when the component mounts
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname])

  useEffect(() => {
    scrollTo(0, 0);
  }, [location])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  // One-time migration: Clean malformed tokens (wrapped in quotes from JSON.stringify)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.startsWith('"') && token.endsWith('"')) {
      // Token is malformed (has quotes from JSON.stringify)
      console.log("🔧 Cleaning malformed token - please login again");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // User will be redirected to login by ProtectedRoute
    }
  }, [])


  // Go upward arrow - show , unshow
  const [showArrow, setShowArrow] = useState(false)

  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true)
    } else setShowArrow(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleArrow);
    return () => {
      window.removeEventListener('scroll', handleArrow);
    }
  }, [showArrow])


  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />

      {/* go upward arrow */}
      <button onClick={() => window.scrollTo(0, 0)}
        className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${showArrow ? 'bottom-6' : '-bottom-24'} `} >
        <HiArrowNarrowUp />
      </button>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="catalog/:catalogName" element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          } />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancel" element={<PaymentCancel />} />

          {/* Open Route - for Only Non Logged in User */}
          <Route
            path="signup" element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route
            path="login" element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="forgot-password" element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />

          <Route
            path="verify-email" element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />

          <Route
            path="update-password/:id" element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />




          {/* Protected Route - for Only Logged in User */}
          {/* Dashboard */}
          <Route element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/Settings" element={<Settings />} />

            {/* Route only for Students */}
            {/* cart , EnrolledCourses */}
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
              </>
            )}

            {/* Route only for Instructors */}
            {/* add course , MyCourses, EditCourse*/}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
              </>
            )}
          </Route>


          {/* For the watching course lectures */}
          <Route
            element={
              <ProtectedRoute>
                <ViewCourse />
              </ProtectedRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            )}
          </Route>




          {/* Page Not Found (404 Page ) */}
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </Suspense>

    </div>
  );
}

export default App;
