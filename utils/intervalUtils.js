/**
 * Merges overlapping intervals and returns a new array of non-overlapping intervals
 * @param {Array} intervals - Array of [start, end] pairs
 * @returns {Array} - Merged intervals
 */
export const mergeIntervals = (intervals) => {
  if (!intervals.length) return []

  // Sort intervals by start time
  const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0])

  const result = [sortedIntervals[0]]

  for (let i = 1; i < sortedIntervals.length; i++) {
    const current = sortedIntervals[i]
    const lastMerged = result[result.length - 1]

    // If current interval overlaps with the last merged interval
    if (current[0] <= lastMerged[1]) {
      // Update the end time of the last merged interval if needed
      lastMerged[1] = Math.max(lastMerged[1], current[1])
    } else {
      // Add the current interval to the result
      result.push(current)
    }
  }

  return result
}

/**
 * Calculates the total time watched from merged intervals
 * @param {Array} mergedIntervals - Array of non-overlapping [start, end] pairs
 * @returns {Number} - Total time watched in seconds
 */
export const calculateWatchedTime = (mergedIntervals) => {
  return mergedIntervals.reduce((total, [start, end]) => {
    return total + (end - start)
  }, 0)
}

/**
 * Calculates the percentage of video watched
 * @param {Number} watchedTime - Total time watched in seconds
 * @param {Number} totalDuration - Total video duration in seconds
 * @returns {Number} - Percentage watched (0-100)
 */
export const calculateProgressPercentage = (watchedTime, totalDuration) => {
  if (!totalDuration) return 0
  return Math.min(100, Math.round((watchedTime / totalDuration) * 100))
}

/**
 * Adds a new interval to existing intervals and merges overlaps
 * @param {Array} existingIntervals - Existing intervals
 * @param {Array} newInterval - New interval to add [start, end]
 * @returns {Array} - Updated merged intervals
 */
export const addAndMergeInterval = (existingIntervals, newInterval) => {
  return mergeIntervals([...existingIntervals, newInterval])
}
