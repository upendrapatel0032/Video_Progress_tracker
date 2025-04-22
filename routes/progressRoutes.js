import express from "express"
import Progress from "../models/Progress.js"
import { calculateWatchedTime, calculateProgressPercentage, addAndMergeInterval } from "../utils/intervalUtils.js"

const router = express.Router()

// Get progress for a specific video
router.get("/:userId/:videoId", async (req, res) => {
  try {
    const { userId, videoId } = req.params

    const progress = await Progress.findOne({ userId, videoId })

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" })
    }

    res.json(progress)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all videos progress for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const progress = await Progress.find({ userId })

    res.json(progress)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update video progress
router.post("/update", async (req, res) => {
  try {
    const { userId, videoId, interval, videoDuration, currentTime } = req.body

    if (!userId || !videoId || !interval || !videoDuration) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Find existing progress or create new
    let progress = await Progress.findOne({ userId, videoId })

    if (!progress) {
      progress = new Progress({
        userId,
        videoId,
        watchedIntervals: [],
        videoDuration,
      })
    }

    // Add and merge the new interval
    const updatedIntervals = addAndMergeInterval(progress.watchedIntervals, interval)

    // Calculate total watched time and percentage
    const watchedTime = calculateWatchedTime(updatedIntervals)
    const progressPercentage = calculateProgressPercentage(watchedTime, videoDuration)

    // Update the progress
    progress.watchedIntervals = updatedIntervals
    progress.progressPercentage = progressPercentage
    progress.lastPosition = currentTime || interval[1]
    progress.videoDuration = videoDuration
    progress.updatedAt = Date.now()

    await progress.save()

    res.json(progress)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
