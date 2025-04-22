Video Progress Tracker

A Video Progress Tracker built using the MERN stack (MongoDB, Express, React, Node.js). This project allows users to track their progress through video-based content, making it ideal for educational platforms or any system that needs to monitor video watching behavior.

Key Features
Track Video Progress: Users can track their progress through videos, ensuring they never miss content.

Resume Watching: The system remembers the point at which a user last stopped, allowing for seamless resumption of videos.

Prevent Redundant Progress: The tracker ensures that skipped or repeated video sections are not counted towards the progress.

Real-Time Progress Update: Progress is updated dynamically as the user watches the video.

MongoDB Integration: Video progress data is securely stored in MongoDB, ensuring scalability and persistence.

Built with MERN Stack: Utilizes MongoDB, Express, React, and Node.js for a robust and scalable architecture.

Tech Stack
Frontend: React.js, Next.js

Backend: Node.js, Express

Database: MongoDB

API: RESTful API for managing video progress data

Additional Libraries: Axios (for API calls), dotenv (for environment variables)

Getting Started : 

Prerequisites : 

Before running the application, ensure you have the following installed:

Node.js and npm or pnpm

MongoDB (Local instance or MongoDB Atlas)

Setup Instructions
Clone the repository:


git clone https://github.com/yourusername/video-progress-tracker.git
cd video-progress-tracker

Backend Setup:
Navigate to the backend folder and install dependencies:


npm install
Create a .env file in the root directory and add your MongoDB URI and desired port:
MONGODB_URI=mongodb://localhost:27017/video-progress
PORT=5000
Start the backend server:


node server.js
The server will be running on http://localhost:5000.


Frontend Setup:
Navigate to the frontend folder and install dependencies:


npm install
Start the frontend development server:

npm run dev
The frontend will be running on http://localhost:3000.

Test the Application:
Open http://localhost:3000 in your browser, and test the video progress tracking functionality.

API Endpoints
GET /api/progress/:userId/:videoId: Retrieve progress for a specific user and video.

GET /api/progress/user/:userId: Retrieve all progress for a user.

POST /api/progress/update: Update video progress.
