// Simple rate limiting implementation for API routes
interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly defaultWindowMs = 15 * 60 * 1000; // 15 minutes
  private readonly defaultMaxRequests = 100;

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Check if request should be rate limited
  isAllowed(
    identifier: string,
    windowMs: number = this.defaultWindowMs,
    maxRequests: number = this.defaultMaxRequests
  ): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanup();
    
    const now = Date.now();
    const entry = this.store.get(identifier);
    
    if (!entry || now > entry.resetTime) {
      // New entry or window reset
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
        lastRequest: now,
      };
      this.store.set(identifier, newEntry);
      
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: newEntry.resetTime,
      };
    }
    
    // Update existing entry
    entry.count++;
    entry.lastRequest = now;
    
    const remaining = Math.max(0, maxRequests - entry.count);
    const allowed = entry.count <= maxRequests;
    
    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
    };
  }

  // Get rate limit info without incrementing
  getStatus(identifier: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.store.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return null;
    }
    
    const remaining = Math.max(0, this.defaultMaxRequests - entry.count);
    
    return {
      count: entry.count,
      remaining,
      resetTime: entry.resetTime,
    };
  }

  // Reset rate limit for identifier
  reset(identifier: string): void {
    this.store.delete(identifier);
  }
}

// Helper functions for common rate limiting scenarios
export const rateLimiter = RateLimiter.getInstance();

// Rate limit by IP address
export const checkIpRateLimit = (
  ip: string,
  windowMs?: number,
  maxRequests?: number
) => {
  return rateLimiter.isAllowed(`ip:${ip}`, windowMs, maxRequests);
};

// Rate limit by user ID (if authenticated)
export const checkUserRateLimit = (
  userId: string,
  windowMs?: number,
  maxRequests?: number
) => {
  return rateLimiter.isAllowed(`user:${userId}`, windowMs, maxRequests);
};

// Rate limit by session ID
export const checkSessionRateLimit = (
  sessionId: string,
  windowMs?: number,
  maxRequests?: number
) => {
  return rateLimiter.isAllowed(`session:${sessionId}`, windowMs, maxRequests);
};

// Express/Next.js middleware helper
export const createRateLimitMiddleware = (
  getKey: (request: any) => string,
  options?: {
    windowMs?: number;
    maxRequests?: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  }
) => {
  const {
    windowMs,
    maxRequests,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options || {};

  return async (request: any, response: any, next?: () => void) => {
    try {
      const key = getKey(request);
      const result = rateLimiter.isAllowed(key, windowMs, maxRequests);
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', maxRequests?.toString() || '100');
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      
      if (!result.allowed) {
        response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
        return new Response(
          JSON.stringify({
            error: 'Too many requests',
            message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      if (next) {
        return next();
      }
      
      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Allow request to proceed if rate limiting fails
      if (next) {
        return next();
      }
      return true;
    }
  };
};
