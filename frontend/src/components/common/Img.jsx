/**
 * @file Img.jsx
 * @description Lazy loading image component with blur effect
 * @module components/common/Img
 * 
 * Wraps react-lazy-load-image-component for optimized image loading.
 * Displays blur placeholder while images load, improving perceived
 * performance and user experience. Used for all images throughout
 * the application including thumbnails, avatars, and banners.
 */

import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const Img = ({ src, className, alt }) => {
    return (
        <LazyLoadImage
            className={`${className} `}
            alt={alt || 'Image'}
            effect='blur'
            src={src}
        />
    )
}


export default Img