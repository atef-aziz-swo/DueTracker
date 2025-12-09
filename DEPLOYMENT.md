# Deployment Guide

This guide covers various deployment options for DueTracker.

## Table of Contents
- [Web Deployment](#web-deployment)
- [Docker Deployment](#docker-deployment)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Cloud Platforms](#cloud-platforms)

## Web Deployment

### Local Development

```bash
npm install
npm run web
```

Access at `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Serving Production Build

Using any static file server:

```bash
# Using serve
npx serve dist

# Using Python
python -m http.server -d dist 8080

# Using Node.js http-server
npx http-server dist
```

## Docker Deployment

### Quick Start with Docker Compose

```bash
docker-compose up -d
```

Access at `http://localhost:8080`

### Manual Docker Build and Run

1. **Build the image:**
   ```bash
   docker build -t duetracker:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 8080:80 --name duetracker duetracker:latest
   ```

3. **View logs:**
   ```bash
   docker logs -f duetracker
   ```

4. **Stop and remove:**
   ```bash
   docker stop duetracker
   docker rm duetracker
   ```

### Using Pre-built Image from GitHub Container Registry

```bash
# Pull the latest image
docker pull ghcr.io/atef-aziz-swo/duetracker:latest

# Run the container
docker run -d -p 8080:80 ghcr.io/atef-aziz-swo/duetracker:latest
```

### Docker Configuration

The Docker setup includes:
- **Multi-stage build** for optimized image size
- **Nginx** as the web server
- **Health checks** for container monitoring
- **Multi-platform support** (amd64, arm64)
- **Gzip compression** for faster loading
- **Security headers** for enhanced security

### Environment Variables

The Docker container supports these environment variables:

- `NODE_ENV` - Set to `production` for production builds

Example:
```bash
docker run -d -p 8080:80 -e NODE_ENV=production duetracker:latest
```

## GitHub Actions CI/CD

The project includes automated CI/CD with GitHub Actions.

### What's Automated

1. **Build Docker Image** - On every push to main/master
2. **Push to Registry** - Automatically pushed to GitHub Container Registry
3. **Multi-platform builds** - Supports both amd64 and arm64
4. **Image Testing** - Automated smoke tests
5. **Semantic Versioning** - Automatic tagging

### Triggering Workflows

The workflow runs on:
- Push to `main` or `master` branch
- Pull requests to `main` or `master`
- Manual trigger via GitHub UI

### Manual Workflow Dispatch

1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Build and Deploy Docker Image"
4. Click "Run workflow"

### Accessing Built Images

Images are available at:
```
ghcr.io/atef-aziz-swo/duetracker:latest
ghcr.io/atef-aziz-swo/duetracker:<branch-name>
ghcr.io/atef-aziz-swo/duetracker:<sha>
```

## Cloud Platforms

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Deploy to AWS (Docker)

1. **Push to Amazon ECR:**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker tag duetracker:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/duetracker:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/duetracker:latest
   ```

2. **Deploy to ECS/Fargate** using the pushed image

### Deploy to Google Cloud Run

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/duetracker

# Deploy to Cloud Run
gcloud run deploy duetracker \
  --image gcr.io/PROJECT-ID/duetracker \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to Azure Container Instances

```bash
# Login to Azure
az login

# Create container
az container create \
  --resource-group myResourceGroup \
  --name duetracker \
  --image ghcr.io/atef-aziz-swo/duetracker:latest \
  --dns-name-label duetracker \
  --ports 80
```

### Deploy to DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure:
   - **Type**: Dockerfile
   - **Dockerfile Path**: `Dockerfile`
   - **HTTP Port**: 80
3. Deploy

### Deploy to Railway

1. Connect GitHub repository to Railway
2. Railway auto-detects Dockerfile
3. Deploy automatically

## Production Considerations

### SSL/HTTPS

For production, use a reverse proxy with SSL:

**Using Caddy:**
```
your-domain.com {
    reverse_proxy localhost:8080
}
```

**Using Nginx with Certbot:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Performance Optimization

1. **Enable CDN** - Use Cloudflare or similar
2. **Compress Assets** - Already enabled in Nginx config
3. **Cache Static Files** - Configure browser caching
4. **Monitor Resources** - Use Docker stats or cloud monitoring

### Monitoring

**Docker logs:**
```bash
docker logs -f duetracker
```

**Container stats:**
```bash
docker stats duetracker
```

**Health check:**
```bash
curl http://localhost:8080
```

## Troubleshooting

### Port Already in Use

Change the port mapping:
```bash
docker run -d -p 3000:80 duetracker:latest
```

### Container Won't Start

Check logs:
```bash
docker logs duetracker
```

### Build Fails

Clear Docker cache:
```bash
docker system prune -a
```

### Out of Memory

Increase Docker memory limits:
```bash
docker run -d -m 512m -p 8080:80 duetracker:latest
```

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Docker logs
