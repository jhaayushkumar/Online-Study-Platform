/**
 * @file constants.js
 * @description Application-wide constant values and enumerations
 * @module utils/constants
 * 
 * Defines constant objects for account types (Student, Instructor, Admin)
 * and course status (Draft, Published). Used throughout the application
 * for role-based access control and course state management.
 */

export const ACCOUNT_TYPE = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  ADMIN: "Admin",
}

export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
}