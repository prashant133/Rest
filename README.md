REST

RUN 
npm install in backend ,frontend/rest-admin, frontend/user
npm run dev

.env example

# MongoDB connection URI
MONGO_URI=mongodb://127.0.0.1:27017/REST

# JWT configuration
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# App environment and port
NODE_ENV=development
PORT=5000

# CORS settings
CORS_ORIGIN=http://localhost:3000
USER_CORS_ORIGIN=http://localhost:5173

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SendGrid configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_VERIFIED_SENDER=your_verified_sender_email
