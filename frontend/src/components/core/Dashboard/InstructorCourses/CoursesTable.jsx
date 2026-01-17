
import { useDispatch, useSelector } from "react-redux"

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

import { useState } from "react"
import { FaCheck, FaEye, FaThumbsUp, FaThumbsDown, FaUsers, FaStar } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import { deleteCourse, fetchInstructorCourses, } from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
import Img from './../../../common/Img';
import toast from 'react-hot-toast'





export default function CoursesTable({ courses, setCourses, loading, setLoading }) {

  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 25

  // delete course
  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    const toastId = toast.loading('Deleting...');
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
    toast.dismiss(toastId)
    // console.log("All Course ", courses)
  }

  // Calculate course stats
  const calculateCourseStats = (course) => {
    const totalStudents = course.studentsEnrolled?.length || 0;
    const totalReviews = course.ratingAndReviews?.length || 0;
    const avgRating = totalReviews > 0 
      ? (course.ratingAndReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
      : 0;
    
    // Mock data for views, likes, dislikes (in real app, this would come from backend)
    const views = Math.floor(Math.random() * 1000) + totalStudents * 5;
    const likes = Math.floor(totalReviews * 0.8);
    const dislikes = Math.floor(totalReviews * 0.1);
    
    return { totalStudents, totalReviews, avgRating, views, likes, dislikes };
  };


  // Loading Skeleton
  const skItem = () => {
    return (
      <div className="flex border-b border-richblack-800 px-6 py-8 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className='h-[148px] min-w-[300px] rounded-xl skeleton '></div>

          <div className="flex flex-col w-[40%]">
            <p className="h-5 w-[50%] rounded-xl skeleton"></p>
            <p className="h-20 w-[60%] rounded-xl mt-3 skeleton"></p>

            <p className="h-2 w-[20%] rounded-xl skeleton mt-3"></p>
            <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Table className="rounded-2xl border border-richblack-800 ">
        {/* heading */}
        <Thead>
          <Tr className="flex gap-x-6 rounded-t-3xl border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100 min-w-[120px]">
              Performance
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100 min-w-[100px]">
              Earnings
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100 min-w-[100px]">
              Actions
            </Th>
          </Tr>
        </Thead>


        {/* loading Skeleton */}
        {loading && <div >
          {skItem()}
          {skItem()}
          {skItem()}
        </div>
        }

        <Tbody>
          {!loading && courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
              </Td>
            </Tr>
          )
            : (
              courses?.map((course) => {
                const stats = calculateCourseStats(course);
                return (
                  <Tr
                    key={course._id}
                    className="flex gap-x-6 border-b border-richblack-800 px-6 py-8 hover:bg-richblack-900/50 transition-colors"
                  >
                    <Td className="flex flex-1 gap-x-4 relative">
                      {/* course Thumbnail */}
                      <Img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className="h-[148px] min-w-[270px] max-w-[270px] rounded-lg object-cover"
                      />

                      <div className="flex flex-col">
                        <p className="text-lg font-semibold text-richblack-5 capitalize">{course.courseName}</p>
                        <p className="text-xs text-richblack-300 ">
                          {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                            ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                            : course.courseDescription}
                        </p>

                        {/* created At */}
                        <p className="text-[12px] text-richblack-100 mt-4">
                          Created: {formatDate(course?.createdAt)}
                        </p>

                        {/* updated At */}
                        <p className="text-[12px] text-richblack-100 ">
                          Updated: {formatDate(course?.updatedAt)}
                        </p>

                        {/* course status */}
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <p className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                            <HiClock size={14} />
                            Drafted
                          </p>)
                          :
                          (<div className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                            <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                              <FaCheck size={8} />
                            </p>
                            Published
                          </div>
                          )}
                      </div>
                    </Td>

                    {/* Performance Stats */}
                    <Td className="text-sm font-medium text-richblack-100 min-w-[120px]">
                      <div className="space-y-2">
                        {/* Students */}
                        <div className="flex items-center gap-2">
                          <FaUsers className="text-blue-400" size={12} />
                          <span className="text-xs">{stats.totalStudents} Students</span>
                        </div>
                        
                        {/* Views */}
                        <div className="flex items-center gap-2">
                          <FaEye className="text-green-400" size={12} />
                          <span className="text-xs">{stats.views} Views</span>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <FaStar className="text-yellow-400" size={12} />
                          <span className="text-xs">{stats.avgRating} ({stats.totalReviews})</span>
                        </div>
                        
                        {/* Likes/Dislikes */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <FaThumbsUp className="text-green-400" size={10} />
                            <span className="text-xs">{stats.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaThumbsDown className="text-red-400" size={10} />
                            <span className="text-xs">{stats.dislikes}</span>
                          </div>
                        </div>
                      </div>
                    </Td>

                    {/* Earnings */}
                    <Td className="text-sm font-medium text-richblack-100 min-w-[100px]">
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-green-400">₹{course.price}</div>
                        <div className="text-xs text-richblack-300">Per Student</div>
                        <div className="text-sm font-semibold text-yellow-400">
                          ₹{(course.price * stats.totalStudents).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-richblack-300">Total Earned</div>
                      </div>
                    </Td>

                    <Td className="text-sm font-medium text-richblack-100 min-w-[100px]">
                      <div className="flex flex-col gap-2">
                        {/* Edit button */}
                        <button
                          disabled={loading}
                          onClick={() => { navigate(`/dashboard/edit-course/${course._id}`) }}
                          title="Edit Course"
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          <FiEdit2 size={14} />
                          <span className="text-xs font-medium">Edit</span>
                        </button>

                        {/* View Details button */}
                        <button
                          onClick={() => navigate(`/courses/${course._id}`)}
                          title="View Course"
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          <FaEye size={14} />
                          <span className="text-xs font-medium">View</span>
                        </button>

                        {/* Delete button */}
                        <button
                          disabled={loading}
                          onClick={() => {
                            setConfirmationModal({
                              text1: "Do you want to delete this course?",
                              text2:
                                "All the data related to this course will be deleted",
                              btn1Text: !loading ? "Delete" : "Loading...  ",
                              btn2Text: "Cancel",
                              btn1Handler: !loading
                                ? () => handleCourseDelete(course._id)
                                : () => { },
                              btn2Handler: !loading
                                ? () => setConfirmationModal(null)
                                : () => { },

                            })
                          }}
                          title="Delete Course"
                          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          <RiDeleteBin6Line size={14} />
                          <span className="text-xs font-medium">Delete</span>
                        </span>
                        </button>
                      </div>
                    </Td>
                  </Tr>
                )
              })
            )}
        </Tbody>
      </Table>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
