/**
 * @file index.js
 * @description Root Redux reducer combining all application slices
 * @module reducer/index
 * 
 * Combines all Redux slices into a single root reducer for the store.
 * Includes auth, profile, course, cart, viewCourse, and sidebar reducers.
 * This centralized reducer configuration enables state management across
 * the entire StudyX application with proper slice isolation.
 */

import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../slices/authSlice"
import cartReducer from "../slices/cartSlice"
import courseReducer from "../slices/courseSlice"
import profileReducer from "../slices/profileSlice"
import viewCourseReducer from "../slices/viewCourseSlice"

import sidebarSlice from "../slices/sidebarSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  cart: cartReducer,
  viewCourse: viewCourseReducer,
  sidebar: sidebarSlice
})

export default rootReducer
