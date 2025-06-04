# REST API Project
A full-stack REST API with admin and user interfaces, built with Node.js, Express, MongoDB, and React.

# Installation
## Clone the repository:

bash
- git clone https://github.com/yourusername/rest-project.git
- cd rest-project
## Install dependencies for all parts:

- bash
- cd backend/src && npm install
- cd ../frontend/rest-admin && npm install
- cd ../user && npm install


# Create a .env file in the backend directory

- MONGO_URI=mongodb://127.0.0.1:27017/REST
- JWT_SECRET=your_jwt_secret
- ACCESS_TOKEN_SECRET=your_access_token_secret
- ACCESS_TOKEN_EXPIRY=15m
- REFRESH_TOKEN_SECRET=your_refresh_token_secret
- REFRESH_TOKEN_EXPIRY=10d
- NODE_ENV=development
- PORT=5000
- CORS_ORIGIN=http://localhost:3000
- USER_CORS_ORIGIN=http://localhost:5173
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret
- SENDGRID_API_KEY=your_sendgrid_api_key
- SENDGRID_VERIFIED_SENDER=your_verified_sender_email

# Running the Application
## Start the backend server:

- bash
- cd backend/src
- npm run dev
## In separate terminals, start the admin and user frontends:

- bash
- cd frontend/rest-admin
- npm run dev
- bash
- cd frontend/user
- npm run dev
