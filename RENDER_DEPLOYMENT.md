# 🚀 Deploy OceanAI to Render.com

## Quick Start Guide

### Step 1: Prepare Your Repository

1. **Push code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify required files exist**:
   - ✅ `render.yaml` (root directory)
   - ✅ `backend/build.sh` (backend directory)
   - ✅ `backend/requirements.txt` (with psycopg2-binary)

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Deploy Using Blueprint (Recommended)

1. **Click "New +" → "Blueprint"**
2. **Connect your repository**: Select `oceanAI` repository
3. **Render will detect** `render.yaml` and show:
   - oceanai-backend (Web Service)
   - oceanai-frontend (Static Site)
   - oceanai-db (PostgreSQL Database)
4. **Click "Apply"**

### Step 4: Configure Environment Variables

#### For Backend Service (`oceanai-backend`):

1. Go to the backend service dashboard
2. Navigate to "Environment" tab
3. Add the following variables:

```
SECRET_KEY=<generate-a-strong-random-string>
GEMINI_API_KEY=<your-gemini-api-key>
FRONTEND_URL=<will-be-provided-after-frontend-deploys>
```

4. **For Google Slides OAuth**:
   - Copy content of `backend/oauth_client.json`
   - Add as `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Paste the entire JSON as a single-line string

#### For Frontend Service (`oceanai-frontend`):

1. Go to the frontend service dashboard
2. Navigate to "Environment" tab
3. Add:

```
VITE_API_URL=<your-backend-url>
```

Example: `https://oceanai-backend.onrender.com`

### Step 5: Update CORS Settings

After deployment, update backend CORS to allow your frontend URL:

1. Edit `backend/app/main.py`
2. Update the CORS origins to include your Render frontend URL
3. Commit and push changes

### Step 6: Handle Google OAuth Token Storage

The current implementation stores tokens in `token.json` file, which won't persist on Render's ephemeral filesystem. You have two options:

**Option A: Store in Database** (Recommended)
- Modify `backend/app/services/google_slides_service.py`
- Store OAuth tokens in the database instead of file system

**Option B: Re-authenticate on each deployment**
- Accept that users will need to re-authenticate after each deployment
- Simpler but less user-friendly

### Step 7: Verify Deployment

1. **Check Backend**:
   - Visit `https://your-backend-url.onrender.com/docs`
   - Should see FastAPI Swagger documentation

2. **Check Frontend**:
   - Visit your frontend URL
   - Should load the OceanAI interface

3. **Test Functionality**:
   - Register a new account
   - Create a project
   - Generate a document
   - Test PPTX generation

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection (auto-provided) | `postgresql://user:pass@host/db` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-here` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | OAuth credentials as JSON string | `{"web":{"client_id":"..."}}` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://oceanai.onrender.com` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://oceanai-backend.onrender.com` |

## Troubleshooting

### Build Fails

- Check Render logs for specific error
- Verify `requirements.txt` is correct
- Ensure Python version compatibility

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly
- Check database service is running
- Review database logs

### CORS Errors

- Ensure `FRONTEND_URL` is set in backend
- Update CORS origins in `main.py`
- Redeploy backend after changes

### Google Slides API Fails

- Verify OAuth credentials are correct
- Check token storage implementation
- Ensure API is enabled in Google Cloud Console

## Free Tier Limitations

- **Backend**: 750 hours/month (enough for one service)
- **Frontend**: Unlimited
- **Database**: Free for 90 days, then $7/month
- **Services sleep after 15 minutes of inactivity** (first request may be slow)

## Production Recommendations

1. **Upgrade to paid plan** for:
   - No sleep on inactivity
   - Better performance
   - More resources

2. **Set up monitoring**:
   - Enable Render notifications
   - Monitor error logs
   - Set up uptime monitoring

3. **Database backups**:
   - Render provides automatic backups on paid plans
   - Consider manual backup strategy for free tier

4. **Custom domain**:
   - Add your own domain in Render dashboard
   - Configure DNS settings

## Next Steps

1. Deploy and test
2. Fix any OAuth token storage issues
3. Test all features thoroughly
4. Set up monitoring
5. Consider upgrading for production use

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- OceanAI Issues: Create issue in your GitHub repository
