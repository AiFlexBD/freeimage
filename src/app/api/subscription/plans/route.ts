import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: {
      imagesPerMonth: 10,
      maxResolution: '1024x1024',
      apiAccess: false,
      bulkDownload: false,
      customGeneration: false,
      prioritySupport: false,
      commercialUse: true,
      attribution: 'optional'
    },
    limits: {
      dailyDownloads: 5,
      monthlyGenerations: 10
    }
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 19,
    interval: 'month',
    stripeProductId: 'prod_starter_2024',
    stripePriceId: 'price_starter_monthly',
    features: {
      imagesPerMonth: 100,
      maxResolution: '2048x2048',
      apiAccess: true,
      bulkDownload: true,
      customGeneration: false,
      prioritySupport: false,
      commercialUse: true,
      attribution: 'not_required'
    },
    limits: {
      dailyDownloads: 25,
      monthlyGenerations: 100,
      apiRequestsPerMonth: 1000
    }
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    price: 49,
    interval: 'month',
    stripeProductId: 'prod_pro_2024',
    stripePriceId: 'price_pro_monthly',
    popular: true,
    features: {
      imagesPerMonth: 500,
      maxResolution: '4096x4096',
      apiAccess: true,
      bulkDownload: true,
      customGeneration: true,
      prioritySupport: true,
      commercialUse: true,
      attribution: 'not_required'
    },
    limits: {
      dailyDownloads: 100,
      monthlyGenerations: 500,
      apiRequestsPerMonth: 5000,
      customGenerationsPerMonth: 50
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    interval: 'month',
    stripeProductId: 'prod_enterprise_2024',
    stripePriceId: 'price_enterprise_monthly',
    features: {
      imagesPerMonth: -1, // unlimited
      maxResolution: '8192x8192',
      apiAccess: true,
      bulkDownload: true,
      customGeneration: true,
      prioritySupport: true,
      commercialUse: true,
      attribution: 'not_required',
      customBranding: true,
      dedicatedSupport: true
    },
    limits: {
      dailyDownloads: -1, // unlimited
      monthlyGenerations: -1, // unlimited
      apiRequestsPerMonth: -1, // unlimited
      customGenerationsPerMonth: -1 // unlimited
    }
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      plans: SUBSCRIPTION_PLANS
    })
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
} 