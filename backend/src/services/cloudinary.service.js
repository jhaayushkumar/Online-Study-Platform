const cloudinary = require('cloudinary').v2;

/**
 * Upload file to Cloudinary
 */
const uploadToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder };
        if (height) options.height = height;
        if (quality) options.quality = quality;
        options.resource_type = 'auto';

        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

/**
 * Delete file from Cloudinary
 */
const deleteFromCloudinary = async (url) => {
    if (!url) return null;

    try {
        // Extract public_id from URL
        const urlParts = url.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExtension.split('.')[0];

        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary delete result:', result);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
