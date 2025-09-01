@echo off
echo 🚀 Deploying AI Task Manager to Netlify...
echo.

echo 📦 Installing Netlify CLI...
npm install -g netlify-cli

echo.
echo 🏗️ Building Frontend...
cd frontend
npm run build
echo ✅ Frontend build complete!

echo.
echo 🚀 Deploying to Netlify...
netlify deploy --prod --dir=build

echo.
echo 🎉 Frontend Deployed to Netlify!
echo 📝 Note: Deploy backend separately to Railway/Render
echo.
pause