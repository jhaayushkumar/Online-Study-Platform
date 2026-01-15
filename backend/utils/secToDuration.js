/**
 * @file secToDuration.js
 * @description Duration formatting utility for the StudyX platform
 * @module utils/secToDuration
 * 
 * Converts total seconds into human-readable duration format.
 * Returns formatted string like "2h 30m" or "45m 30s" or "30s"
 * based on the duration length. Used for displaying video/course durations.
 */

function convertSecondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor((totalSeconds % 3600) % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

module.exports = {
  convertSecondsToDuration,
}