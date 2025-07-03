# Deployment Guide

## 🚀 Deploying to Vercel

This project is now configured for deployment to Vercel. Follow these steps:

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository (recommended for automatic deployments)

### Frontend Deployment (React App)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the React app and use the correct build settings
   - Click "Deploy"

3. **Environment Variables** (for production):
   - In your Vercel dashboard, go to your project settings
   - Add environment variables as needed (see `.env.example`)

### Backend Deployment Options

Since this app has a full Express.js backend, you have several options:

#### Option 1: Deploy Backend Separately (Recommended)
Deploy the backend to a service like:
- **Railway**: Great for Node.js apps with databases
- **Render**: Free tier available for hobby projects  
- **Heroku**: Popular platform (has free tier limitations)

#### Option 2: Convert to Serverless Functions
Convert the Express routes to Vercel serverless functions (more complex but fully integrated).

### Local Development

```bash
# Install all dependencies
npm run install-all

# Start both client and server in development
npm run dev

# Build for production
npm run build

# Start production server only (backend)
npm start
```

### Available Scripts

- `npm run dev` - Start both client (port 3000) and server (port 5000) in development
- `npm run client:dev` - Start only React development server
- `npm run server:dev` - Start only Express server in development
- `npm run build` - Build React app for production
- `npm start` - Start production Express server
- `npm run install-all` - Install dependencies for root, server, and client

### Important Notes

1. **Database**: The SQLite database is stored locally. For production, consider using:
   - PostgreSQL (Railway, Render)
   - MongoDB (MongoDB Atlas)
   - MySQL (PlanetScale)

2. **API Endpoints**: Update `REACT_APP_API_URL` in your environment variables to point to your deployed backend.

3. **CORS**: Make sure your backend CORS settings allow requests from your Vercel domain.

### Deployment Checklist

- [ ] All dependencies installed (`npm run install-all`)
- [ ] Build process works (`npm run build`)
- [ ] Environment variables configured
- [ ] Backend deployed to separate service (if using Option 1)
- [ ] Frontend deployed to Vercel
- [ ] API URL updated in frontend environment variables
- [ ] Database configured for production

### Troubleshooting

- **Build fails**: Check that all dependencies are installed in all directories
- **API not working**: Verify backend deployment and API URL configuration
- **CORS errors**: Check backend CORS configuration for production domain