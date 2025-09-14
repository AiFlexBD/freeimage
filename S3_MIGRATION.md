# 🚀 AWS S3 Migration Guide

Complete guide to migrate your images from Supabase Storage to AWS S3 with CloudFront CDN.

## 📋 Prerequisites

1. **AWS Account** with S3 and CloudFront access
2. **AWS CLI** installed and configured
3. **Node.js dependencies** installed

## 🔧 Step 1: AWS Setup

### 1.1 Configure AWS CLI
```bash
# Install AWS CLI if not already installed
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure with your credentials
aws configure
# Enter your Access Key ID, Secret Access Key, Region (us-east-1), and output format (json)
```

### 1.2 Create S3 Bucket
```bash
# Create bucket (replace with your preferred name)
aws s3 mb s3://imagegenfree-images --region us-east-1

# Enable public read access
aws s3api put-bucket-policy --bucket imagegenfree-images --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::imagegenfree-images/*"
    }
  ]
}'

# Enable CORS for web access
aws s3api put-bucket-cors --bucket imagegenfree-images --cors-configuration '{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "MaxAgeSeconds": 3000
    }
  ]
}'
```

### 1.3 Set up CloudFront Distribution (Optional but Recommended)
```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "imagegenfree-'$(date +%s)'",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-imagegenfree-images",
        "DomainName": "imagegenfree-images.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-imagegenfree-images",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true,
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "Comment": "ImageGenFree CDN",
  "Enabled": true
}'
```

## 🛠️ Step 2: Install Dependencies

```bash
# Install required packages
npm install aws-sdk sharp @supabase/supabase-js

# Or with yarn
yarn add aws-sdk sharp @supabase/supabase-js
```

## ⚙️ Step 3: Environment Configuration

Add these variables to your `.env.local` file:

```bash
# AWS Configuration
AWS_S3_BUCKET=imagegenfree-images
AWS_REGION=us-east-1
CLOUDFRONT_DOMAIN=d123456789.cloudfront.net  # Optional: Your CloudFront domain

# Existing Supabase config (already present)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🚀 Step 4: Run Migration

```bash
# Make the script executable
chmod +x scripts/migrate-to-s3.js

# Run the migration
node scripts/migrate-to-s3.js
```

### Migration Process:
1. **Downloads** all images from Supabase Storage
2. **Optimizes** images in 4 sizes (original, thumbnail, medium, large)
3. **Converts** to WebP format for better compression
4. **Uploads** to S3 with proper caching headers
5. **Updates** database with new S3/CloudFront URLs

## 📊 Expected Results

### Performance Improvements:
- **50-70% smaller file sizes** (WebP vs PNG/JPEG)
- **Global CDN delivery** via CloudFront
- **Multiple image sizes** for responsive design
- **1-year browser caching** for faster repeat visits

### Cost Estimation:
- **S3 Storage**: ~$0.023 per GB/month
- **CloudFront**: ~$0.085 per GB transferred
- **For 1000 images (~2GB)**: ~$0.05/month storage + transfer costs

## 🔄 Step 5: Update Application Code

The migration script automatically updates your database URLs, but you may want to update your image utility functions:

```typescript
// src/lib/imageUtils.ts - Updated for S3/CloudFront
export function getOptimizedImageUrl(
  originalUrl: string,
  size: 'thumbnail' | 'medium' | 'large' | 'original' = 'thumbnail'
): string {
  if (!originalUrl) return originalUrl;
  
  // If it's already an S3 URL, modify for different sizes
  if (originalUrl.includes('amazonaws.com') || originalUrl.includes('cloudfront.net')) {
    return originalUrl.replace('/original.webp', `/${size}.webp`);
  }
  
  // Fallback to original URL
  return originalUrl;
}
```

## 🧪 Step 6: Testing

1. **Check a few images** manually in browser
2. **Verify different sizes** load correctly
3. **Test CDN caching** with browser dev tools
4. **Monitor S3/CloudFront** metrics in AWS console

## 🔧 Troubleshooting

### Common Issues:

1. **AWS Credentials Error**:
   ```bash
   aws configure list  # Verify credentials are set
   ```

2. **S3 Bucket Access Denied**:
   - Check bucket policy is applied
   - Verify bucket name is correct

3. **Migration Fails**:
   - Check environment variables
   - Verify Supabase connection
   - Check available disk space

4. **Images Not Loading**:
   - Verify CORS configuration
   - Check CloudFront distribution status
   - Test direct S3 URLs first

## 📈 Monitoring & Maintenance

### AWS Console Monitoring:
- **S3**: Monitor storage usage and requests
- **CloudFront**: Track cache hit ratio and data transfer
- **CloudWatch**: Set up alerts for unusual usage

### Regular Tasks:
- **Monthly cost review** in AWS billing
- **Image optimization audit** for new uploads
- **CDN cache performance** monitoring

## 🎉 Benefits After Migration

✅ **Faster Loading**: Images load 2-3x faster globally  
✅ **Lower Costs**: Reduced bandwidth costs vs Supabase  
✅ **Better SEO**: Faster page speeds improve rankings  
✅ **Scalability**: Handle millions of images efficiently  
✅ **Reliability**: 99.9% uptime with AWS infrastructure  

---

**Need Help?** Check the migration logs or run with `--verbose` flag for detailed output. 