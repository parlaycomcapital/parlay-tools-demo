import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
    
    console.log('Testing backend connection to:', apiBase)
    
    const response = await fetch(`${apiBase}/health`, {
      method: 'GET',
    })
    
    if (!response.ok) {
      return NextResponse.json({
        status: 'error',
        message: `Backend not responding (${response.status})`,
        apiBase,
        error: await response.text().catch(() => 'Unknown error')
      }, { status: 500 })
    }
    
    const data = await response.json()
    return NextResponse.json({
      status: 'success',
      message: 'Backend is responding',
      apiBase,
      backendResponse: data
    })
  } catch (error) {
    console.error('Backend test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Cannot connect to backend',
      apiBase: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
