# QuickChat

A full-stack chat application built using modern web technologies like JavaScript, React.js, Node.js, Express.js, Socket.IO, React-Redux, and JWT. This application enables real-time, bi-directional communication with secure user authentication and an optimized user experience.
<img width="1327" alt="Screenshot 2024-08-08 at 4 57 12 PM" src="https://github.com/user-attachments/assets/1ea6cf36-7917-4fdd-8c94-1b7456d4b63a">

## Technologies Used

- **Frontend:** React.js, React-Redux
- **Backend:** Node.js, Express.js
- **Real-Time Communication:** Socket.IO
- **Authentication:** JWT (JSON Web Token)
- **File Upload:** Multer
- **State Management:** React-Redux

## Features

- **Real-Time Communication:** Implemented Socket.IO for real-time, bi-directional communication between users, ensuring instant message delivery.
- **Secure Authentication:** Integrated JWT for secure user authentication and authorization, ensuring that only authenticated users can access the chat platform.
- **Infinite Scroll:** Engineered an infinite scroll feature for chat windows, allowing users to seamlessly load older messages while maintaining optimal performance.
- **File Upload:** Used Multer for handling file uploads, enabling users to share images and other files directly in the chat.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YourUsername/QuickChat.git
   cd QuickChat
2.	Install dependencies for both frontend and backend:
# Install backend dependencies
cd backend
npm install

## Install frontend dependencies
cd ../frontend
npm install

3.	Set up environment variables:
Create a .env file in the backend directory with the following variables:
MONGO_URI = 
PORT = 
JWT_SECRET = 
ADMIN_SECRET_KEY = 
NODE_ENV = 
CLIENT_URL = 
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

## Start the backend server
cd backend
npm start

## Start the frontend server
cd ../frontend
npm run dev

# Usage

	•	Chat: Communicate in real-time with other users.
	•	Authentication: Securely log in and out of your account.
	•	File Sharing: Upload and share files within the chat.



# Contributing

Contributions are welcome! If you have any suggestions or find any issues, please open an issue or submit a pull request.

# License

This project is licensed under the MIT License.

