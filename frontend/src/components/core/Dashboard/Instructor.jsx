import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"
import Img from './../../common/Img';



export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])


  // get Instructor Data
  useEffect(() => {
    ; (async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      // console.log('INSTRUCTOR_API_RESPONSE.....', instructorApiData)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0)

  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)


  // skeleton loading
  const skItem = () => {
    return (
      <div className="mt-5 w-full flex flex-col justify-between  rounded-xl ">
        <div className="flex border p-4 border-richblack-600 ">
          <div className="w-full">
            <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            <div className="mt-3 flex gap-x-5">
              <p className="w-[200px] h-4 rounded-xl skeleton"></p>
              <p className="w-[100px] h-4 rounded-xl skeleton"></p>
            </div>

            <div className="flex justify-center items-center flex-col">
              <div className="w-[80%] h-24 rounded-xl mt-5 skeleton"></div>
              {/* circle */}
              <div className="w-60 h-60 rounded-full  mt-4 grid place-items-center skeleton"></div>
            </div>
          </div>
          {/* right column */}
          <div className="sm:flex hidden min-w-[250px] flex-col rounded-xl p-6 skeleton"></div>
        </div>

        {/* bottom row */}
        <div className="flex flex-col gap-y-6  mt-5">
          <div className="flex justify-between">
            <p className="text-lg font-bold text-richblack-5 pl-5">Your Courses</p>
            <Link to="/dashboard/my-courses">
              <p className="text-xs font-semibold text-yellow-50 hover:underline pr-5">View All</p>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row  gap-6 ">
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
            <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2 bg-gradient-to-r from-richblack-800 to-richblack-900 p-6 rounded-xl border border-richblack-700">
        <h1 className="text-3xl font-bold text-richblack-5 text-center sm:text-left">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-lg font-medium text-richblack-200 text-center sm:text-left">
          Here's what's happening with your courses today
        </p>
      </div>


      {loading ? (
        <div>
          {skItem()}
        </div>
      )
        :
        courses.length > 0 ? (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/dashboard/add-course" className="group">
                <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 hover:border-yellow-50 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-50/10">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">➕</div>
                    <div>
                      <p className="text-lg font-semibold text-richblack-5 group-hover:text-yellow-50 transition-colors">Add New Course</p>
                      <p className="text-sm text-richblack-300">Create a new course</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/dashboard/my-courses" className="group">
                <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 hover:border-blue-400 transition-all duration-200 hover:shadow-lg hover:shadow-blue-400/10">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📋</div>
                    <div>
                      <p className="text-lg font-semibold text-richblack-5 group-hover:text-blue-400 transition-colors">Manage Courses</p>
                      <p className="text-sm text-richblack-300">Edit your courses</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/dashboard/settings" className="group">
                <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 hover:border-green-400 transition-all duration-200 hover:shadow-lg hover:shadow-green-400/10">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">⚙️</div>
                    <div>
                      <p className="text-lg font-semibold text-richblack-5 group-hover:text-green-400 transition-colors">Settings</p>
                      <p className="text-sm text-richblack-300">Update your profile</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="my-4 flex flex-col lg:flex-row gap-4">
              {/* Render chart / graph */}
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={instructorData} />
              ) : (
                <div className="flex-1 rounded-xl bg-richblack-800 p-6 border border-richblack-700">
                  <p className="text-2xl font-bold text-richblack-5">Analytics</p>
                  <div className="flex flex-col items-center justify-center h-64 mt-4">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-xl font-medium text-richblack-300">
                      Not Enough Data To Visualize
                    </p>
                    <p className="text-sm text-richblack-400 mt-2">
                      Create courses and get students to see analytics
                    </p>
                  </div>
                </div>
              )}

              {/* Statistics Cards */}
              <div className="flex min-w-[280px] flex-col gap-4">
                {/* Total Courses Card */}
                <div className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-800 p-6 border border-blue-700 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-200">Total Courses</p>
                      <p className="text-4xl font-bold text-white mt-2">
                        {courses.length}
                      </p>
                    </div>
                    <div className="text-5xl">📚</div>
                  </div>
                </div>

                {/* Total Students Card */}
                <div className="rounded-xl bg-gradient-to-br from-green-900 to-green-800 p-6 border border-green-700 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-200">Total Students</p>
                      <p className="text-4xl font-bold text-white mt-2">
                        {totalStudents}
                      </p>
                    </div>
                    <div className="text-5xl">👥</div>
                  </div>
                </div>

                {/* Total Income Card */}
                <div className="rounded-xl bg-gradient-to-br from-yellow-900 to-yellow-800 p-6 border border-yellow-700 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-200">Total Income</p>
                      <p className="text-4xl font-bold text-white mt-2">
                        ₹{totalAmount?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-5xl">💰</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Courses Section */}
            <div className="rounded-xl bg-richblack-800 p-6 border border-richblack-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold text-richblack-5">Your Courses</p>
                  <p className="text-sm text-richblack-300 mt-1">Manage and track your course performance</p>
                </div>
                <Link to="/dashboard/my-courses">
                  <button className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200">
                    View All →
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 3).map((course) => (
                  <div key={course._id} className="group bg-richblack-700 rounded-xl overflow-hidden border border-richblack-600 hover:border-yellow-50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-50/10">
                    <div className="relative overflow-hidden">
                      <Img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-[180px] w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-richblack-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <p className="text-yellow-50 font-semibold text-sm">₹{course.price}</p>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-lg font-semibold text-richblack-5 line-clamp-2 mb-3">
                        {course.courseName}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-richblack-300">
                          <span className="text-lg">👥</span>
                          <span className="font-medium">{course.studentsEnrolled.length} Students</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-50">⭐</span>
                          <span className="text-richblack-300 font-medium">
                            {course.ratingAndReviews?.length || 0} Reviews
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-richblack-600">
                        <div className="flex items-center justify-between text-xs text-richblack-400">
                          <span>Status: <span className="text-green-400 font-semibold">{course.status}</span></span>
                          <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-xl bg-gradient-to-br from-richblack-800 to-richblack-900 p-12 py-20 border-2 border-dashed border-richblack-600">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="text-8xl">📚</div>
              <div className="text-center space-y-3">
                <p className="text-3xl font-bold text-richblack-5">
                  No Courses Yet
                </p>
                <p className="text-lg text-richblack-300 max-w-md">
                  Start your teaching journey by creating your first course and share your knowledge with students worldwide
                </p>
              </div>

              <Link to="/dashboard/add-course">
                <button className="mt-4 px-8 py-4 bg-yellow-50 text-richblack-900 rounded-xl font-bold text-lg hover:bg-yellow-100 hover:scale-105 transition-all duration-200 shadow-lg">
                  Create Your First Course →
                </button>
              </Link>
            </div>
          </div>
        )}
    </div>
  )
}
