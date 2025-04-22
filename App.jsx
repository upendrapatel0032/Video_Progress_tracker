"use client"

import { useState } from "react"
import VideoPlayer from "./components/VideoPlayer"
import "./App.css"

function App() {
  // In a real app, these would come from authentication and video selection
  const [userId] = useState("user123")
  const [selectedVideo, setSelectedVideo] = useState({
    id: "video1",
    title: "Introduction to React",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  })

  // Sample video library
  const videoLibrary = [
    {
      id: "video1",
      title: "Introduction to React",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "video2",
      title: "Advanced JavaScript Concepts",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "video3",
      title: "MongoDB for Beginners",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  return (
    <div className="app-container">
      <header>
        <h1>Video Learning Platform</h1>
        <p>User: {userId}</p>
      </header>

      <main>
        <div className="video-section">
          <h2>{selectedVideo.title}</h2>
          <VideoPlayer userId={userId} videoId={selectedVideo.id} videoSrc={selectedVideo.src} />
        </div>

        <div className="video-library">
          <h3>Video Library</h3>
          <div className="video-list">
            {videoLibrary.map((video) => (
              <div
                key={video.id}
                className={`video-item ${selectedVideo.id === video.id ? "active" : ""}`}
                onClick={() => setSelectedVideo(video)}
              >
                <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} />
                <div className="video-title">{video.title}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
