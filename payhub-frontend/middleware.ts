import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Shim para requests /@vite/client em ambiente Next
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/@vite/client') {
    return new Response('// Vite HMR shim: ignorado no Next dev', {
      status: 200,
      headers: { 'Content-Type': 'application/javascript' },
    })
  }
  return NextResponse.next()
}