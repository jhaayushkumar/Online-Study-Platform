/**
 * @file avgRating.js
 * @description Utility function for calculating average course rating
 * @module utils/avgRating
 * 
 * Computes the average rating from an array of rating objects.
 * Returns 0 for empty arrays and rounds result to one decimal place.
 * Used in course cards and course details to display aggregate ratings.
 */

export default function GetAvgRating(ratingArr) {
  if (ratingArr?.length === 0) return 0
  const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    acc += curr.rating
    return acc
  }, 0)

  const multiplier = Math.pow(10, 1)
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier

  return avgReviewCount
}