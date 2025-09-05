# FreeImage Deployment Guide

## Option 1: Deploy to Vercel (Recommended - Free)

### Why Vercel?
- ✅ **Free tier** with generous limits
- ✅ **Built for Next.js** - zero configuration
- ✅ **API routes work perfectly**
- ✅ **Automatic deployments** from Git
- ✅ **Global CDN** included
- ✅ **Custom domain** support

### Steps:
1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository
   - Add environment variables
   - Deploy automatically

3. **Add your custom domain**:
   - In Vercel dashboard → Settings → Domains
   - Add your Hostinger domain
   - Update DNS records in Hostinger

## Option 2: Hostinger VPS (Full Control)

### Requirements:
- VPS plan ($5-25/month)
- Node.js 18+ support
- PM2 for process management
- Nginx for reverse proxy

### Steps:

#### 1. Prepare for deployment:
```bash
# Build the application
npm run build

# Create deployment package
tar -czf freeimage-app.tar.gz .next package.json package-lock.json src public
```

#### 2. VPS Setup:
```bash
# Connect to VPS
ssh root@your-vps-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt update
sudo apt install nginx
```

#### 3. Deploy application:
```bash
# Upload and extract
scp freeimage-app.tar.gz root@your-vps-ip:/var/www/
cd /var/www
tar -xzf freeimage-app.tar.gz

# Install dependencies
npm install --production

# Start with PM2
pm2 start npm --name "freeimage" -- start
pm2 startup
pm2 save
```

#### 4. Nginx configuration:
```nginx
# /etc/nginx/sites-available/freeimage
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/freeimage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Option 3: Hostinger Cloud Hosting

### Requirements:
- Business plan or higher
- Node.js support enabled
- SSH access

### Steps:
1. **Check Node.js support** in your Hostinger panel
2. **Enable Node.js** for your domain
3. **Upload files** via File Manager or SSH
4. **Install dependencies**: `npm install --production`
5. **Start application**: Configure in hosting panel

## Environment Variables Setup

For any deployment option, you'll need these environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Generation
GEMINI_API_KEY=your_gemini_api_key

# AdSense
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-your-publisher-id
NEXT_PUBLIC_ADSENSE_ENABLED=true

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Domain Setup

### If using Vercel + Hostinger domain:
1. **In Vercel**: Add custom domain
2. **In Hostinger DNS**: Add CNAME record pointing to Vercel

### If using Hostinger hosting:
1. **Point domain** to your server IP
2. **Configure SSL** certificate
3. **Update environment** variables

## Recommendation

**For your use case, I recommend Vercel** because:
- ✅ **Free and reliable**
- ✅ **Perfect Next.js support**
- ✅ **API routes work flawlessly**
- ✅ **Global CDN for better performance**
- ✅ **Easy custom domain setup**
- ✅ **Automatic HTTPS**

You can keep your domain with Hostinger and just point it to Vercel! 