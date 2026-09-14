# CBZ Holdings Web Application

A modern, responsive web application built with React 19, Vite, TypeScript, and Tailwind CSS.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The app will be accessible at [http://localhost:3000](http://localhost:3000).

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

The application is containerized with a production-optimized, multi-stage Docker build utilizing `node:20-alpine` for building and `nginx:alpine` for fast, lightweight static file serving.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Option A: Using Docker Compose (Recommended)
```bash
# Build and start the container
docker compose up -d --build

# View logs
docker compose logs -f

# Stop the container
docker compose down
```
Access the application at [http://localhost:3000](http://localhost:3000).

### Option B: Using Plain Docker CLI
```bash
# Build Docker image
docker build -t work-website:latest .

# Run container on port 3000
docker run -d -p 3000:80 --name work-website-app work-website:latest
```

---

## ▲ Vercel Deployment

The project is pre-configured with [vercel.json](file:///c:/Users/mmabobe/Desktop/work%20website/vercel.json) and [.vercelignore](file:///c:/Users/mmabobe/Desktop/work%20website/.vercelignore) for seamless static single-page application (SPA) deployment, including client-side route rewrites, asset caching, and security headers.

### Option A: Deploy via Vercel CLI
```bash
# Log in to Vercel (if not already logged in)
npx vercel login

# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```

### Option B: Deploy via GitHub / GitLab / Bitbucket
1. Push this repository to GitHub or GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** > **"Project"**.
3. Import your repository.
4. Vercel will automatically detect Vite and use:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

---

## 📁 Key Project Files

- [package.json](file:///c:/Users/mmabobe/Desktop/work%20website/package.json): Project dependencies and npm scripts.
- [Dockerfile](file:///c:/Users/mmabobe/Desktop/work%20website/Dockerfile): Multi-stage Docker build file.
- [docker-compose.yml](file:///c:/Users/mmabobe/Desktop/work%20website/docker-compose.yml): Docker compose specification.
- [nginx.conf](file:///c:/Users/mmabobe/Desktop/work%20website/nginx.conf): Nginx configuration with gzip compression, security headers, and SPA fallback.
- [vercel.json](file:///c:/Users/mmabobe/Desktop/work%20website/vercel.json): Vercel routing, rewrite rules, and headers.
- [.dockerignore](file:///c:/Users/mmabobe/Desktop/work%20website/.dockerignore): Excluded files for Docker build context.
- [.vercelignore](file:///c:/Users/mmabobe/Desktop/work%20website/.vercelignore): Excluded files for Vercel uploads.
