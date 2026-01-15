/**
 * @file sidebarSlice.js
 * @description Sidebar Redux slice for managing sidebar visibility state
 * @module slices/sidebarSlice
 * 
 * Controls sidebar menu visibility across the application including main
 * navigation sidebar and course view sidebar. Tracks screen size for
 * responsive behavior and provides actions to toggle sidebar states
 * for both mobile and desktop layouts.
 */

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    openSideMenu: false,
    screenSize: undefined,

    // course view side bar
    courseViewSidebar: false,
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setOpenSideMenu: (state, action) => {
            // console.log('action.payload == ', action.payload)
            state.openSideMenu = action.payload
        },
        setScreenSize: (state, action) => {
            state.screenSize = action.payload
        },
        setCourseViewSidebar: (state, action) => {
            state.courseViewSidebar = action.payload
        }

    }
})

export const { setOpenSideMenu, setScreenSize, setCourseViewSidebar } = sidebarSlice.actions

export default sidebarSlice.reducer



