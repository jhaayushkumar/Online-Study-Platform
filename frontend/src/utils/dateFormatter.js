/**
 * @file dateFormatter.js
 * @description Date formatting utility for display purposes
 * @module utils/dateFormatter
 * 
 * Converts date strings to human-readable format with full month name,
 * day, and year. Used for displaying course creation dates, enrollment
 * dates, and other timestamps throughout the application.
 */

export const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}