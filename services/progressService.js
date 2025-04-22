import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Get progress for a specific video
export const getVideoProgress = async (userId, videoId) => {
  try {
    const response = await axios.get(`${API_URL}/progress/${userId}/${videoId}`)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No progress found yet, which is fine
      return null
    }
    throw error
  }
}

// Get all videos progress for a user
export const getUserProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/progress/user/${userId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update video progress
export const updateVideoProgress = async (progressData) => {
  try {
    const response = await axios.post(`${API_URL}/progress/update`, progressData)
    return response.data
  } catch (error) {
    throw error
  }
}
