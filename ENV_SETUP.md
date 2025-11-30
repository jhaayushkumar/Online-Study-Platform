# 🔐 Environment Variables - Quick Reference

## Backend `.env` File
**Location:** `/Users/ayushkumarjha/Desktop/study/backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/studyx
# OR for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/studyx

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary (File Storage)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=StudyX

# Email Configuration (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
MAIL_FROM=your_email@gmail.com

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Razorpay (Optional Alternative)
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

---

## Frontend `.env` File
**Location:** `/Users/ayushkumarjha/Desktop/study/frontend/.env`

```env
# Backend API URL
VITE_APP_BASE_URL=http://localhost:5000/api/v1

# Stripe Publishable Key
VITE_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Google OAuth Client ID (Optional)
VITE_REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Razorpay Key (Optional Alternative)
VITE_APP_RAZORPAY_KEY=your_razorpay_key_id
```

---

## ✅ Already Configured

- ✅ **Stripe Secret Key** (Backend)
- ✅ **Stripe Publishable Key** (Frontend)

---

## 🔧 Still Need to Configure

### 1. **Database** (MongoDB)
- **Option A - Local**: Install MongoDB locally
- **Option B - Atlas**: Create free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

### 2. **Cloudinary** (File Uploads)
- Sign up at [cloudinary.com](https://cloudinary.com)
- Get: Cloud Name, API Key, API Secret from Dashboard

### 3. **Gmail App Password** (Email)
- Enable 2-Factor Authentication on Gmail
- Create App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### 4. **JWT Secret**
Generate a random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Quick Start Commands

```bash
# Backend
cd /Users/ayushkumarjha/Desktop/study/backend
npm install
npm run dev

# Frontend (new terminal)
cd /Users/ayushkumarjha/Desktop/study/frontend
npm install
npm run dev
```

---

## 📋 Service Setup Priority

1. **Essential (Required to run)**:
   - ✅ Database (MongoDB)
   - ✅ JWT Secret
   - ✅ Cloudinary
   - ✅ Email (Gmail)

2. **Payment (Already Done ✅)**:
   - ✅ Stripe Keys

3. **Optional**:
   - ⭕ Google OAuth
   - ⭕ Razorpay

---

## 💡 Pro Tips

- Keep `.env` files **OUT** of git (already in `.gitignore`)
- Never share your secret keys publicly
- Use different keys for development and production
- Store production keys securely (Vercel/Render environment variables)
