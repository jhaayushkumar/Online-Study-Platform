/**
 * @file Img.jsx
 * @description Optimized lazy loading image component with blur effect
 * @module components/common/Img
 * 
 * Wraps react-lazy-load-image-component for optimized image loading.
 * Displays blur placeholder while images load, improving perceived
 * performance and user experience. Used for all images throughout
 * the application including thumbnails, avatars, and banners.
 */

import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const Img = ({ src, className, alt, eager = false }) => {
    const [imageError, setImageError] = useState(false);

    // Fallback image if original fails to load
    const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23374151' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%239CA3AF' text-anchor='middle' dy='.3em' font-family='Arial' font-size='16'%3EImage Not Available%3C/text%3E%3C/svg%3E";

    return (
        <LazyLoadImage
            className={`${className} `}
            alt={alt || 'Image'}
            effect='blur'
            src={imageError ? fallbackImage : src}
            loading={eager ? 'eager' : 'lazy'}
            threshold={50}
            onError={() => setImageError(true)}
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23374151' width='400' height='300'/%3E%3C/svg%3E"
            wrapperClassName="w-full h-full"
        />
    )
}


export default Img