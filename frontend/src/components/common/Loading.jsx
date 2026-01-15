/**
 * @file Loading.jsx
 * @description Loading spinner component for async operations
 * @module components/common/Loading
 * 
 * Displays a custom CSS loading animation while content is being fetched.
 * Used throughout the application during API calls, page transitions,
 * and data loading states to provide visual feedback to users.
 */

import React from 'react';

const Loading = () => {
    return (
        <div className='flex flex-col justify-center items-center gap-3 '>
            <div className="custom-loader"></div>
        </div>
    );
}

export default Loading;
