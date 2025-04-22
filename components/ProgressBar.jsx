"use client"

import { useRef } from "react"
import "./ProgressBar.css"

const ProgressBar = ({ progress, currentTime, duration, watchedIntervals, onProgressClick }) => {
  const progressBarRef = useRef(null)

  // Calculate current playback position as percentage
  const currentPosition = duration ? (currentTime / duration) * 100 : 0

  // Handle click on progress bar
  const handleClick = (e) => {
    if (!progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const percentClicked = (clickPosition / rect.width) * 100

    onProgressClick(Math.max(0, Math.min(100, percentClicked)))
  }

  // Render watched segments
  const renderWatchedSegments = () => {
    if (!watchedIntervals || !duration) return null

    return watchedIntervals.map((interval, index) => {
      const [start, end] = interval
      const startPercent = (start / duration) * 100
      const widthPercent = ((end - start) / duration) * 100

      return (
        <div
          key={index}
          className="watched-segment"
          style={{
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
          }}
        />
      )
    })
  }

  return (
    <div className="progress-bar-container" ref={progressBarRef} onClick={handleClick}>
      <div className="progress-bar-background">{renderWatchedSegments()}</div>

      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />

      <div className="progress-bar-playhead" style={{ left: `${currentPosition}%` }} />
    </div>
  )
}

export default ProgressBar
