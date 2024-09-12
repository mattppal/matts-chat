import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting
// In a production environment, you'd want to use a distributed store like Redis
const rateLimit = new Map();

// Rate limit configuration
const RATE_LIMIT = 10; // requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

export function middleware(request: NextRequest) {
    // Only apply rate limiting to the chat API route
    if (request.nextUrl.pathname.startsWith('/api/chat')) {
        const ip = request.ip ?? '127.0.0.1';
        const now = Date.now();
        const windowStart = now - RATE_LIMIT_WINDOW;

        const requestTimestamps = rateLimit.get(ip) || [];
        const requestsInWindow = requestTimestamps.filter((timestamp: number) => timestamp > windowStart);

        if (requestsInWindow.length >= RATE_LIMIT) {
            return new NextResponse(JSON.stringify({ error: 'RATE_LIMIT_EXCEEDED' }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW / 1000)),
                },
            });
        }

        // Remove timestamps outside the current window
        rateLimit.set(ip, requestsInWindow);

        // Add the current request timestamp
        requestsInWindow.push(now);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};