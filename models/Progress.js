import mongoose from "mongoose"

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  videoId: {
    type: String,
    required: true,
    index: true,
  },
  // Store watched intervals as array of [start, end] pairs
  watchedIntervals: {
    type: [[Number, Number]],
    default: [],
  },
  // Percentage of video watched (0-100)
  progressPercentage: {
    type: Number,
    default: 0,
  },
  // Last position in the video
  lastPosition: {
    type: Number,
    default: 0,
  },
  // Total duration of the video in seconds
  videoDuration: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index for faster queries
ProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true })

export default mongoose.model("Progress", ProgressSchema)
