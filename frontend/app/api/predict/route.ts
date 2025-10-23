import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
    
    // Add debugging info
    console.log('API Base URL:', apiBase)
    console.log('Request body:', body)
    
    const response = await fetch(`${apiBase}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
      console.error('Backend error:', errorData)
      return NextResponse.json(errorData, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { 
        detail: 'Failed to fetch prediction', 
        error: error instanceof Error ? error.message : 'Unknown error',
        apiBase: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
      },
      { status: 500 }
    )
  }
}
