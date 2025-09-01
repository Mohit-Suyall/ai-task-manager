@echo off
echo 🚀 Deploying AI Task Manager to Vercel...
echo.

echo 📦 Installing Vercel CLI...
npm install -g vercel

echo.
echo 🏗️ Building Frontend...
cd frontend
npm run build
echo ✅ Frontend build complete!

echo.
echo 🚀 Deploying Frontend to Vercel...
vercel --prod
echo ✅ Frontend deployed!

echo.
echo 🏗️ Deploying Backend to Vercel...
cd ..\backend

echo Creating vercel.json...
echo {> vercel.json
echo   "version": 2,>> vercel.json
echo   "builds": [>> vercel.json
echo     {>> vercel.json
echo       "src": "server-port8000.js",>> vercel.json
echo       "use": "@vercel/node">> vercel.json
echo     }>> vercel.json
echo   ],>> vercel.json
echo   "routes": [>> vercel.json
echo     {>> vercel.json
echo       "src": "/(.*)",>> vercel.json
echo       "dest": "/server-port8000.js">> vercel.json
echo     }>> vercel.json
echo   ]>> vercel.json
echo }>> vercel.json

vercel --prod
echo ✅ Backend deployed!

echo.
echo 🎉 Deployment Complete!
echo 📱 Your app is now live on Vercel!
echo.
pause