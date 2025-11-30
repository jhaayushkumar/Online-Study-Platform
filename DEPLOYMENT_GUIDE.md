# StudyX Deployment Guide 🚀

This guide will walk you through deploying your StudyX application to production.

## 📋 Prerequisites Checklist

Before deploying, ensure you have:

- [x] GitHub repository with latest code pushed
- [ ] MongoDB Atlas account and connection string
- [ ] Cloudinary account (cloud name, API key, secret)
- [ ] Razorpay account (key ID and secret)
- [ ] Gmail account with app password
- [ ] Google OAuth credentials (client ID and secret)

---

## 🔧 Part 1: Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** button → **"Web Service"**
2. Connect your **StudyX** repository
3. Configure the service:
   - **Name**: `studyx-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Select **Free** plan

### Step 3: Add Environment Variables

Click **"Advanced"** and add these environment variables:

```env
NODE_ENV=production
PORT=5002
DATABASE_URL=<your_mongodb_atlas_connection_string>
JWT_SECRET=<your_jwt_secret_key>
CLOUD_NAME=<your_cloudinary_cloud_name>
API_KEY=<your_cloudinary_api_key>
API_SECRET=<your_cloudinary_api_secret>
FOLDER_NAME=StudyX
MAIL_HOST=smtp.gmail.com
MAIL_USER=<your_gmail_address>
MAIL_PASS=<your_gmail_app_password>
RAZORPAY_KEY=<your_razorpay_key_id>
RAZORPAY_SECRET=<your_razorpay_secret>
FRONTEND_URL=<will_add_after_frontend_deployment>
GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
GOOGLE_CLIENT_SECRET=<your_google_oauth_client_secret>
```

### Step 4: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://studyx-backend.onrender.com`)

✅ **Backend deployed!** Test it: `https://your-backend-url.onrender.com/`

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your **StudyX** repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables

Add these environment variables:

```env
VITE_APP_BASE_URL=<your_render_backend_url>/api/v1
VITE_APP_RAZORPAY_KEY=<your_razorpay_key_id>
VITE_REACT_APP_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
```

**Example:**
```env
VITE_APP_BASE_URL=https://studyx-backend.onrender.com/api/v1
VITE_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxxx
VITE_REACT_APP_GOOGLE_CLIENT_ID=123456789-xxxxx.apps.googleusercontent.com
```

### Step 4: Deploy Frontend
1. Click **"Deploy"**
2. Wait for build (2-5 minutes)
3. Copy your frontend URL (e.g., `https://studyx.vercel.app`)

✅ **Frontend deployed!**

---

## 🔄 Part 3: Update Backend CORS

Now that frontend is deployed, update backend environment variable:

1. Go back to Render dashboard
2. Open your **studyx-backend** service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
5. Save changes (this will trigger a redeploy)

---

## ✅ Part 4: Verification

Test these features on your production site:

### Authentication
- [ ] Sign up with email
- [ ] Receive and verify OTP
- [ ] Login
- [ ] Google OAuth login
- [ ] Password reset

### Instructor Features
- [ ] Create a course
- [ ] Upload course thumbnail
- [ ] Add sections and lectures
- [ ] Upload video content
- [ ] Publish course

### Student Features
- [ ] Browse courses
- [ ] Add to cart
- [ ] Checkout and payment
- [ ] Access purchased course
- [ ] Watch videos
- [ ] Rate and review

### Profile
- [ ] Update profile information
- [ ] Change password
- [ ] View dashboard

---

## 🎯 Quick Commands Reference

### Push code to GitHub:
```bash
git add .
git commit -m "Deployment configuration"
git push origin main
```

### Test backend locally:
```bash
cd backend && npm run dev
```

### Test frontend locally:
```bash
cd frontend && npm run dev
```

### Build frontend locally:
```bash
cd frontend && npm run build
```

---

## 🆘 Troubleshooting

### Backend Issues

**Problem**: Build fails on Render
- Check if all dependencies are in `package.json`
- Verify Node version compatibility
- Check build logs for specific errors

**Problem**: Environment variables not working
- Ensure there are no extra spaces in variable values
- Redeploy after adding/updating variables
- Check variable names match exactly

**Problem**: Database connection fails
- Verify MongoDB Atlas connection string
- Check IP whitelist (allow 0.0.0.0/0 for Render)
- Ensure database user has proper permissions

### Frontend Issues

**Problem**: API calls failing
- Verify `VITE_APP_BASE_URL` is correct
- Check CORS settings on backend
- Inspect browser console for errors

**Problem**: Build fails on Vercel
- Check build logs
- Ensure `npm run build` works locally
- Verify all dependencies are installed

**Problem**: Environment variables not working
- Vercel requires `VITE_` prefix for env vars
- Redeploy after adding variables
- Check variable names match code

---

## 📊 Monitoring

### Render Dashboard
- View deployment logs
- Monitor CPU/memory usage
- Check request metrics

### Vercel Dashboard
- View build logs
- Monitor bandwidth
- Check deployment status

---

## 💰 Costs

- **Render Free Tier**: Perfect for testing, sleeps after 15 min inactivity
- **Vercel Free Tier**: 100GB bandwidth/month, unlimited deployments
- **Upgrade**: Consider paid plans for production use

---

## 🎉 Success!

Your StudyX platform should now be live! Share your URLs:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`

---

## 📝 Notes

- Free tier backends on Render sleep after inactivity (first request may be slow)
- Always test thoroughly before sharing publicly
- Monitor usage to stay within free tier limits
- Consider upgrading for production traffic

**Happy Deploying! 🚀**
