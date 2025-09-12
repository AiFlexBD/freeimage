import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const AZURE_OPENAI_CONFIG = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
  apiKey: process.env.AZURE_OPENAI_API_KEY || '',
  apiVersion: '2024-02-01'
}

export async function GET() {
  try {
    console.log('🧪 Testing Azure OpenAI connection...')
    
    if (!AZURE_OPENAI_CONFIG.endpoint || !AZURE_OPENAI_CONFIG.apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing configuration',
        config: {
          hasEndpoint: !!AZURE_OPENAI_CONFIG.endpoint,
          hasApiKey: !!AZURE_OPENAI_CONFIG.apiKey,
          endpoint: AZURE_OPENAI_CONFIG.endpoint || 'missing'
        }
      })
    }

    // Test 1: Check if we can connect to Azure OpenAI
    const modelsUrl = `${AZURE_OPENAI_CONFIG.endpoint}/openai/models?api-version=${AZURE_OPENAI_CONFIG.apiVersion}`
    
    console.log('📡 Testing models endpoint:', modelsUrl)
    
    const modelsResponse = await fetch(modelsUrl, {
      method: 'GET',
      headers: {
        'api-key': AZURE_OPENAI_CONFIG.apiKey
      }
    })

    let modelsResult = null
    let modelsError = null

    if (modelsResponse.ok) {
      modelsResult = await modelsResponse.json()
      console.log('✅ Models API success')
    } else {
      modelsError = {
        status: modelsResponse.status,
        statusText: modelsResponse.statusText,
        body: await modelsResponse.text()
      }
      console.log('❌ Models API failed:', modelsError)
    }

    // Test 2: Check deployments endpoint
    const deploymentsUrl = `${AZURE_OPENAI_CONFIG.endpoint}/openai/deployments?api-version=${AZURE_OPENAI_CONFIG.apiVersion}`
    
    console.log('📡 Testing deployments endpoint:', deploymentsUrl)
    
    const deploymentsResponse = await fetch(deploymentsUrl, {
      method: 'GET',
      headers: {
        'api-key': AZURE_OPENAI_CONFIG.apiKey
      }
    })

    let deploymentsResult = null
    let deploymentsError = null

    if (deploymentsResponse.ok) {
      deploymentsResult = await deploymentsResponse.json()
      console.log('✅ Deployments API success')
    } else {
      deploymentsError = {
        status: deploymentsResponse.status,
        statusText: deploymentsResponse.statusText,
        body: await deploymentsResponse.text()
      }
      console.log('❌ Deployments API failed:', deploymentsError)
    }

    // Test 3: Try a simple completions test (if available)
    const completionsUrl = `${AZURE_OPENAI_CONFIG.endpoint}/openai/completions?api-version=${AZURE_OPENAI_CONFIG.apiVersion}`
    
    const completionsResponse = await fetch(completionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_CONFIG.apiKey
      },
      body: JSON.stringify({
        prompt: 'Hello',
        max_tokens: 1
      })
    })

    let completionsTest = null
    if (completionsResponse.ok) {
      completionsTest = { success: true, status: completionsResponse.status }
    } else {
      completionsTest = { 
        success: false, 
        status: completionsResponse.status,
        error: await completionsResponse.text()
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Azure OpenAI connection test completed',
      config: {
        endpoint: AZURE_OPENAI_CONFIG.endpoint,
        apiVersion: AZURE_OPENAI_CONFIG.apiVersion,
        hasApiKey: !!AZURE_OPENAI_CONFIG.apiKey
      },
      tests: {
        models: {
          success: !!modelsResult,
          result: modelsResult,
          error: modelsError
        },
        deployments: {
          success: !!deploymentsResult,
          result: deploymentsResult,
          error: deploymentsError
        },
        completions: completionsTest
      },
      recommendations: [
        modelsError ? 'Models API failed - check your API key and endpoint' : 'Models API working',
        deploymentsError ? 'Deployments API failed - you may need to create deployments via Azure portal' : 'Deployments API working',
        !deploymentsResult?.data?.length ? 'No deployments found - you need to deploy DALL-E 3 model' : 'Deployments found'
      ]
    })

  } catch (error) {
    console.error('❌ Azure OpenAI test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      config: {
        endpoint: AZURE_OPENAI_CONFIG.endpoint || 'missing',
        hasApiKey: !!AZURE_OPENAI_CONFIG.apiKey
      }
    })
  }
} 