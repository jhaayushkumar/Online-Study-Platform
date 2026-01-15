/**
 * Convert seconds to human-readable duration
 * @param {number} totalSeconds - Total seconds
 * @returns {string} Formatted duration string
 */
const convertSecondsToDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds === 0) return '0s';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0 || result === '') result += `${seconds}s`;

    return result.trim();
};

/**
 * Format duration to MM:SS
 * @param {number} durationInSeconds 
 * @returns {string}
 */
const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

module.exports = { convertSecondsToDuration, formatDuration };
