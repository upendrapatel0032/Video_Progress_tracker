"use client"

import { useState, useRef, useEffect } from "react"
import { updateVideoProgress, getVideoProgress } from "../services/progressService"
import ProgressBar from "./ProgressBar"
import "./VideoPlayer.css"

const VideoPlayer = ({ userId, videoId, videoSrc }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [buffering, setBuffering] = useState(false)
  const [watchedIntervals, setWatchedIntervals] = useState([])

  // Track the current interval being watched
  const currentIntervalRef = useRef(null)

  // Minimum interval length to track (in seconds)
  const MIN_INTERVAL_LENGTH = 1

  useEffect(() => {
    // Load saved progress when component mounts
    const loadProgress = async () => {
      try {
        const savedProgress = await getVideoProgress(userId, videoId)
        if (savedProgress) {
          setWatchedIntervals(savedProgress.watchedIntervals)
          setProgress(savedProgress.progressPercentage)

          // Resume from last position
          if (videoRef.current && savedProgress.lastPosition) {
            videoRef.current.currentTime = savedProgress.lastPosition
          }
        }
      } catch (error) {
        console.error("Error loading progress:", error)
      }
    }

    loadProgress()
  }, [userId, videoId])

  // Handle video metadata loaded
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // Start tracking interval when video plays
  const handlePlay = () => {
    setIsPlaying(true)

    // Start a new interval from current position
    if (!currentIntervalRef.current) {
      currentIntervalRef.current = [videoRef.current.currentTime, videoRef.current.currentTime]
    }
  }

  // End tracking interval when video pauses
  const handlePause = async () => {
    setIsPlaying(false)

    // Finalize the current interval if it exists and is long enough
    if (currentIntervalRef.current) {
      const [start, end] = currentIntervalRef.current
      currentIntervalRef.current = null

      // Only save intervals that are longer than minimum length
      if (end - start >= MIN_INTERVAL_LENGTH) {
        await saveProgress([start, end])
      }
    }
  }

  // Update current time and interval end time while playing
  const handleTimeUpdate = () => {
    if (!videoRef.current) return

    const newTime = videoRef.current.currentTime
    setCurrentTime(newTime)

    // Update the end time of the current interval
    if (isPlaying && currentIntervalRef.current) {
      currentIntervalRef.current[1] = newTime
    }
  }

  // Save progress to the server
  const saveProgress = async (newInterval) => {
    try {
      if (!videoRef.current) return

      const response = await updateVideoProgress({
        userId,
        videoId,
        interval: newInterval,
        videoDuration: duration,
        currentTime: videoRef.current.currentTime,
      })

      if (response) {
        setWatchedIntervals(response.watchedIntervals)
        setProgress(response.progressPercentage)
      }
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  // Handle seeking in the video
  const handleSeek = () => {
    if (!isPlaying) return

    // When seeking during playback, save the current interval and start a new one
    if (currentIntervalRef.current) {
      const [start, end] = currentIntervalRef.current

      // Only save if the interval is long enough
      if (end - start >= MIN_INTERVAL_LENGTH) {
        saveProgress([start, end])
      }

      // Start a new interval from the current position
      currentIntervalRef.current = [videoRef.current.currentTime, videoRef.current.currentTime]
    }
  }

  // Handle video ended event
  const handleEnded = async () => {
    setIsPlaying(false)

    // Save the final interval
    if (currentIntervalRef.current) {
      await saveProgress(currentIntervalRef.current)
      currentIntervalRef.current = null
    }
  }

  // Handle buffering detection
  const handleWaiting = () => {
    setBuffering(true)
  }

  const handleCanPlay = () => {
    setBuffering(false)
  }

  // Handle progress bar click to seek
  const handleProgressBarClick = (percent) => {
    if (videoRef.current && duration) {
      // End current interval if playing
      if (isPlaying && currentIntervalRef.current) {
        const [start, end] = currentIntervalRef.current
        if (end - start >= MIN_INTERVAL_LENGTH) {
          saveProgress([start, end])
        }
      }

      // Seek to the new position
      const newTime = (percent / 100) * duration
      videoRef.current.currentTime = newTime

      // Start a new interval if playing
      if (isPlaying) {
        currentIntervalRef.current = [newTime, newTime]
      }
    }
  }

  // Format time display (MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={videoSrc}
          onLoadedMetadata={handleMetadataLoaded}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onSeeking={handleSeek}
          onEnded={handleEnded}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          onClick={() => (isPlaying ? videoRef.current.pause() : videoRef.current.play())}
        />

        {buffering && <div className="buffering-indicator">Loading...</div>}
      </div>

      <div className="controls">
        <button
          className="play-pause-btn"
          onClick={() => (isPlaying ? videoRef.current.pause() : videoRef.current.play())}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <ProgressBar
          progress={progress}
          currentTime={currentTime}
          duration={duration}
          watchedIntervals={watchedIntervals}
          onProgressClick={handleProgressBarClick}
        />

        <div className="progress-percentage">{progress}% watched</div>
      </div>
    </div>
  )
}

export default VideoPlayer
