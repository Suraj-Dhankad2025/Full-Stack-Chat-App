# QuickChat

A full-stack chat application built using modern web technologies like JavaScript, React.js, Node.js, Express.js, Socket.IO, React-Redux, and JWT. This application enables real-time, bi-directional communication with secure user authentication and an optimized user experience.

![QuickChat Screenshot](https://github.com/user-attachments/assets/1ea6cf36-7917-4fdd-8c94-1b7456d4b63a)

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

2. **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install

3. **Install backend dependencies:**
    ```bash
    cd backend
    npm install

4.	**Set up environment variables:**
    ***Create a .env file in the backend directory with the following variables:***

    ````bash
    MONGO_URI=<your_mongo_uri>
    PORT=<your_port>
    JWT_SECRET=<your_jwt_secret>
    ADMIN_SECRET_KEY=<your_admin_secret_key>
    NODE_ENV=<your_node_env>
    CLIENT_URL=<your_client_url>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

4.	**Start the backend server:**

    cd backend
    npm start
    Usage

        •	Chat: Communicate in real-time with other users.
        •	Authentication: Securely log in and out of your account.
        •	File Sharing: Upload and share files within the chat.

    Contributing

    Contributions are welcome! If you have any suggestions or find any issues, please open an issue or submit a pull request.

    License

    This project is licensed under the MIT License.