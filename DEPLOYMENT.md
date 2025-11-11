# 🚀 Deploying Neo-BBS to Vercel

This guide will help you deploy both the frontend and backend to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account with connection strings
- OpenAI API key

## Option 1: Deploy via Vercel CLI (Recommended)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy Frontend

```bash
cd frontend
vercel --prod
```

### 4. Deploy Backend

```bash
cd backend
vercel --prod
```

### 5. Set Environment Variables

In your Vercel dashboard for the backend project, add these environment variables:

```
MONGODB_CRYPT_URI=your_crypt_cluster_uri
MONGODB_PARLOR_URI=your_parlor_cluster_uri
MONGODB_COMEDY_URI=your_comedy_cluster_uri
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key_for_jwt
```

## Option 2: Deploy via Vercel Dashboard

### Frontend Deployment

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. **Framework Preset**: Create React App
5. **Build Command**: `npm run build`
6. **Output Directory**: `build`
7. Click **Deploy**

### Backend Deployment

1. Create a new project in Vercel
2. Import the same GitHub repository
3. Set **Root Directory** to `backend`
4. **Framework Preset**: Other
5. Add environment variables (see above)
6. Click **Deploy**

## Environment Variables

### Backend (.env)

```env
# MongoDB Atlas
MONGODB_CRYPT_URI=mongodb+srv://...
MONGODB_PARLOR_URI=mongodb+srv://...
MONGODB_COMEDY_URI=mongodb+srv://...

# OpenAI
OPENAI_API_KEY=sk-...

# JWT Secret
SECRET_KEY=your-secret-key-here

# CORS (add your Vercel frontend URL)
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## Post-Deployment

1. **Update CORS**: Add your frontend Vercel URL to backend CORS settings
2. **Update API URL**: Set `REACT_APP_API_URL` in frontend environment variables
3. **Test**: Visit your frontend URL and test the command system

## Troubleshooting

### Backend Issues

- **Cold starts**: Vercel serverless functions may have cold starts (3-5 seconds)
- **Timeout**: Increase function timeout in vercel.json if needed
- **Logs**: Check Vercel dashboard → Your Project → Functions → Logs

### Frontend Issues

- **API not connecting**: Check REACT_APP_API_URL is set correctly
- **CORS errors**: Ensure backend ALLOWED_ORIGINS includes your frontend URL
- **Build fails**: Check Node version compatibility

## Custom Domain (Optional)

1. Go to your Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

## Monitoring

- **Frontend**: Vercel Analytics (automatic)
- **Backend**: Vercel Functions logs
- **Database**: MongoDB Atlas monitoring

## Cost Considerations

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - Serverless function execution time limits
  - Good for development and small projects

- **MongoDB Atlas Free Tier**:
  - 512MB storage
  - Shared cluster
  - Good for development

For production, consider upgrading both services.

## Support

For issues, check:
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Project Issues: https://github.com/Fnc-Jit/BSS-OLD/issues
