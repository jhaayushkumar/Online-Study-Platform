# StudyNotion - Complete Setup Guide 🚀

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Environment Variables Configuration](#environment-variables-configuration)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **npm** (v6.x or higher) or **yarn**
- **MongoDB** (v4.x or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud database)
- **Git** - [Download](https://git-scm.com/downloads)

### Required Accounts

You'll need to create accounts for the following services:

1. **MongoDB Atlas** (if not using local MongoDB) - [Sign Up](https://www.mongodb.com/cloud/atlas/register)
2. **Cloudinary** (for media storage) - [Sign Up](https://cloudinary.com/users/register/free)
3. **Razorpay** (for payment integration) - [Sign Up](https://dashboard.razorpay.com/signup)
4. **Gmail Account** (for sending emails via nodemailer)

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- express
- mongoose
- bcrypt
- jsonwebtoken
- cloudinary
- razorpay
- nodemailer
- and more...

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Now edit the `.env` file with your actual credentials (see [Environment Variables Configuration](#environment-variables-configuration) section below).

### Step 4: Verify Backend Structure

Ensure your backend directory has the following structure:

```
backend/
├── config/
│   ├── database.js
│   ├── cloudinary.js
│   └── razorpay.js
├── controllers/
│   ├── auth.js
│   ├── course.js
│   ├── payments.js
│   ├── profile.js
│   ├── resetPassword.js
│   ├── section.js
│   ├── subSection.js
│   ├── category.js
│   ├── ratingAndReview.js
│   ├── courseProgress.js
│   └── contactUs.js
├── middleware/
│   └── auth.js
├── models/
│   ├── user.js
│   ├── course.js
│   ├── section.js
│   ├── subSection.js
│   ├── category.js
│   ├── profile.js
│   ├── OTP.js
│   ├── ratingAndReview.js
│   └── courseProgress.js
├── routes/
│   ├── user.js
│   ├── course.js
│   ├── payments.js
│   ├── profile.js
│   └── contact.js
├── mail/
│   └── templates/
│       ├── emailVerificationTemplate.js
│       ├── passwordUpdate.js
│       ├── courseEnrollmentEmail.js
│       └── contactFormRes.js
├── utils/
│   ├── mailSender.js
│   ├── imageUploader.js
│   └── secToDuration.js
├── .env
├── .env.example
├── package.json
└── server.js
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- react
- react-router-dom
- redux toolkit
- axios
- tailwindcss
- framer-motion
- react-hot-toast
- and more...

### Step 3: Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_APP_BASE_URL=http://localhost:5000/api/v1
VITE_APP_RAZORPAY_KEY=your_razorpay_key_id
```

### Step 4: Verify Frontend Structure

Ensure your frontend directory has the following structure:

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── core/
│   │   └── ...
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CourseDetails.jsx
│   │   └── ...
│   ├── services/
│   │   ├── operations/
│   │   ├── apis.js
│   │   └── apiConnector.js
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── cartSlice.js
│   │   ├── courseSlice.js
│   │   ├── profileSlice.js
│   │   └── ...
│   ├── reducer/
│   │   └── index.js
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── package.json
├── tailwind.config.cjs
├── vite.config.js
└── index.html
```

---

## Environment Variables Configuration

### Backend Environment Variables (`.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/studynotion
# OR use MongoDB Atlas:
# DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/studynotion

# JWT Secret Key (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=StudyNotion

# Mail Configuration (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_specific_password

# Razorpay Configuration
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables (`.env`)

```env
# Backend API URL
VITE_APP_BASE_URL=http://localhost:5000/api/v1

# Razorpay Key
VITE_APP_RAZORPAY_KEY=your_razorpay_key_id
```

### How to Get Required Credentials

#### 1. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `studynotion`

#### 2. Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

#### 3. Razorpay Setup
1. Sign up at [Razorpay](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live Keys
4. Copy:
   - Key ID
   - Key Secret

#### 4. Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

---

## Running the Application

### Option 1: Run Backend and Frontend Separately

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Option 2: Run Both Concurrently (from root)

If you want to run both from the root directory, you can create a script:

```bash
# In one terminal
cd backend && npm run dev

# In another terminal
cd frontend && npm run dev
```

---

## Testing

### Backend Testing

1. **Test Database Connection:**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: "Database connected successfully"

2. **Test API Endpoints:**
   - Use Postman or Thunder Client
   - Test the default route: `GET http://localhost:5000/`
   - Test auth routes: `POST http://localhost:5000/api/v1/auth/sendotp`

### Frontend Testing

1. **Test Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser

2. **Test Features:**
   - Homepage loads correctly
   - Navigation works
   - Login/Signup forms are functional
   - API calls connect to backend

---

## Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare for deployment:**
   - Ensure all environment variables are set
   - Update CORS origin to your frontend URL
   - Set `NODE_ENV=production`

2. **Deploy to Render:**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add all environment variables

### Frontend Deployment (Netlify/Vercel)

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables

3. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
**Problem:** "Error while connecting server with Database"

**Solution:**
- Check if MongoDB is running locally: `mongod --version`
- Verify DATABASE_URL in .env file
- Check network access in MongoDB Atlas (allow all IPs: 0.0.0.0/0)

#### 2. Cloudinary Upload Error
**Problem:** Images not uploading

**Solution:**
- Verify Cloudinary credentials in .env
- Check folder name matches FOLDER_NAME in .env
- Ensure file size is within limits

#### 3. Email Not Sending
**Problem:** OTP or emails not being sent

**Solution:**
- Verify Gmail app password (not regular password)
- Enable "Less secure app access" if needed
- Check MAIL_HOST, MAIL_USER, MAIL_PASS in .env

#### 4. Payment Integration Error
**Problem:** Razorpay payment not working

**Solution:**
- Use test mode keys for development
- Verify RAZORPAY_KEY and RAZORPAY_SECRET
- Check if Razorpay account is activated

#### 5. CORS Error
**Problem:** "Access-Control-Allow-Origin" error

**Solution:**
- Update CORS origin in backend/server.js
- Add your frontend URL to allowed origins
- Ensure credentials: true is set

#### 6. Port Already in Use
**Problem:** "Port 5000 is already in use"

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=5001
```

---

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Razorpay Documentation](https://razorpay.com/docs/)

---

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are correctly set
3. Ensure all dependencies are installed
4. Check if all services (MongoDB, Cloudinary, Razorpay) are properly configured

---

## Project Structure Summary

```
study/
├── backend/              # Node.js + Express backend
│   ├── config/          # Database and service configurations
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── mail/            # Email templates
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
│
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── slices/      # Redux slices
│   │   └── App.jsx      # Main app component
│   └── package.json
│
└── README.md            # Project documentation
```

---

**Happy Coding! 🎉**

For any questions or issues, please create an issue in the repository.
