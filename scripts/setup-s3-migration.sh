#!/bin/bash

# 🚀 AWS S3 Migration Setup Script
# This script prepares your environment for migrating images to AWS S3

set -e  # Exit on any error

echo "🚀 Setting up AWS S3 migration environment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
check_aws_cli() {
    echo -e "${BLUE}Checking AWS CLI...${NC}"
    if ! command -v aws &> /dev/null; then
        echo -e "${YELLOW}AWS CLI not found. Installing...${NC}"
        
        # Install AWS CLI based on OS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install awscli
            else
                echo -e "${RED}Please install Homebrew first or install AWS CLI manually${NC}"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
            unzip awscliv2.zip
            sudo ./aws/install
            rm -rf awscliv2.zip aws/
        else
            echo -e "${RED}Please install AWS CLI manually for your OS${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ AWS CLI found${NC}"
    fi
}

# Check AWS credentials
check_aws_credentials() {
    echo -e "${BLUE}Checking AWS credentials...${NC}"
    if aws sts get-caller-identity &> /dev/null; then
        echo -e "${GREEN}✅ AWS credentials configured${NC}"
        aws sts get-caller-identity --output table
    else
        echo -e "${YELLOW}⚠️  AWS credentials not configured${NC}"
        echo "Please run: aws configure"
        echo "You'll need:"
        echo "  - AWS Access Key ID"
        echo "  - AWS Secret Access Key"
        echo "  - Default region (e.g., us-east-1)"
        echo "  - Default output format (json)"
        echo ""
        read -p "Do you want to configure AWS now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            aws configure
        else
            echo -e "${RED}❌ AWS credentials required for migration${NC}"
            exit 1
        fi
    fi
}

# Install Node.js dependencies
install_dependencies() {
    echo -e "${BLUE}Installing Node.js dependencies...${NC}"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found. Are you in the correct directory?${NC}"
        exit 1
    fi
    
    # Install required packages
    echo "Installing aws-sdk, sharp, and @supabase/supabase-js..."
    
    if command -v yarn &> /dev/null; then
        yarn add aws-sdk sharp @supabase/supabase-js
    else
        npm install aws-sdk sharp @supabase/supabase-js
    fi
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Create S3 bucket
create_s3_bucket() {
    echo -e "${BLUE}Setting up S3 bucket...${NC}"
    
    # Get bucket name from user
    read -p "Enter your S3 bucket name (e.g., imagegenfree-images): " BUCKET_NAME
    
    if [ -z "$BUCKET_NAME" ]; then
        echo -e "${RED}❌ Bucket name cannot be empty${NC}"
        exit 1
    fi
    
    # Get region
    read -p "Enter AWS region (default: us-east-1): " REGION
    REGION=${REGION:-us-east-1}
    
    echo "Creating bucket: $BUCKET_NAME in region: $REGION"
    
    # Create bucket
    if aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"; then
        echo -e "${GREEN}✅ Bucket created successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Bucket might already exist or there was an error${NC}"
    fi
    
    # Set bucket policy for public read
    echo "Setting bucket policy for public read access..."
    aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "{
        \"Version\": \"2012-10-17\",
        \"Statement\": [
            {
                \"Sid\": \"PublicReadGetObject\",
                \"Effect\": \"Allow\",
                \"Principal\": \"*\",
                \"Action\": \"s3:GetObject\",
                \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
            }
        ]
    }"
    
    # Set CORS configuration
    echo "Setting CORS configuration..."
    aws s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration "{
        \"CORSRules\": [
            {
                \"AllowedOrigins\": [\"*\"],
                \"AllowedHeaders\": [\"*\"],
                \"AllowedMethods\": [\"GET\", \"HEAD\"],
                \"MaxAgeSeconds\": 3000
            }
        ]
    }"
    
    echo -e "${GREEN}✅ S3 bucket configured${NC}"
    
    # Update .env.local
    echo "Updating .env.local with S3 configuration..."
    if [ -f ".env.local" ]; then
        # Remove existing AWS config if present
        sed -i.bak '/^AWS_S3_BUCKET=/d; /^AWS_REGION=/d' .env.local
    fi
    
    # Add new AWS config
    echo "" >> .env.local
    echo "# AWS S3 Configuration" >> .env.local
    echo "AWS_S3_BUCKET=$BUCKET_NAME" >> .env.local
    echo "AWS_REGION=$REGION" >> .env.local
    
    echo -e "${GREEN}✅ Environment variables updated${NC}"
    
    # Store bucket info for CloudFront setup
    echo "$BUCKET_NAME" > .s3-bucket-name
    echo "$REGION" > .s3-region
}

# Optional: Create CloudFront distribution
setup_cloudfront() {
    echo -e "${BLUE}Setting up CloudFront CDN (optional but recommended)...${NC}"
    
    read -p "Do you want to set up CloudFront CDN? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        BUCKET_NAME=$(cat .s3-bucket-name)
        
        echo "Creating CloudFront distribution..."
        echo "This may take 10-15 minutes to fully deploy..."
        
        DISTRIBUTION_ID=$(aws cloudfront create-distribution \
            --distribution-config "{
                \"CallerReference\": \"imagegenfree-$(date +%s)\",
                \"Origins\": {
                    \"Quantity\": 1,
                    \"Items\": [
                        {
                            \"Id\": \"S3-$BUCKET_NAME\",
                            \"DomainName\": \"$BUCKET_NAME.s3.amazonaws.com\",
                            \"S3OriginConfig\": {
                                \"OriginAccessIdentity\": \"\"
                            }
                        }
                    ]
                },
                \"DefaultCacheBehavior\": {
                    \"TargetOriginId\": \"S3-$BUCKET_NAME\",
                    \"ViewerProtocolPolicy\": \"redirect-to-https\",
                    \"MinTTL\": 0,
                    \"DefaultTTL\": 86400,
                    \"MaxTTL\": 31536000,
                    \"Compress\": true,
                    \"TrustedSigners\": {
                        \"Enabled\": false,
                        \"Quantity\": 0
                    },
                    \"ForwardedValues\": {
                        \"QueryString\": false,
                        \"Cookies\": {
                            \"Forward\": \"none\"
                        }
                    }
                },
                \"Comment\": \"ImageGenFree CDN\",
                \"Enabled\": true
            }" --query 'Distribution.DomainName' --output text)
        
        echo -e "${GREEN}✅ CloudFront distribution created${NC}"
        echo "Domain: $DISTRIBUTION_ID"
        echo "Note: It may take 10-15 minutes for the distribution to be fully deployed"
        
        # Add to .env.local
        echo "CLOUDFRONT_DOMAIN=$DISTRIBUTION_ID" >> .env.local
        echo -e "${GREEN}✅ CloudFront domain added to environment${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping CloudFront setup${NC}"
    fi
}

# Main setup function
main() {
    echo -e "${GREEN}🚀 AWS S3 Migration Setup${NC}"
    echo "=================================="
    echo ""
    
    check_aws_cli
    echo ""
    
    check_aws_credentials
    echo ""
    
    install_dependencies
    echo ""
    
    create_s3_bucket
    echo ""
    
    setup_cloudfront
    echo ""
    
    echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review your .env.local file"
    echo "2. Run the migration: node scripts/migrate-to-s3.js"
    echo "3. Monitor the migration progress"
    echo ""
    echo "For detailed instructions, see S3_MIGRATION.md"
}

# Run main function
main 